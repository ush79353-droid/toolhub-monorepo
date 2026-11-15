import { NextResponse } from 'next/server';
import { getAdminSessionToken } from '@/server/auth/session';

export async function PUT(request: Request) {
  const sessionId = await getAdminSessionToken();
  if (!sessionId) {
    return NextResponse.json({ success: false, error: { message: 'Sign in again.' } }, { status: 401 });
  }

  const key = new URL(request.url).searchParams.get('key');
  if (!key) {
    return NextResponse.json({ success: false, error: { message: 'Missing storage key.' } }, { status: 400 });
  }

  const base = (process.env.API_INTERNAL_URL || 'http://localhost:5001/api/v1').replace(/\/$/, '');
  const response = await fetch(`${base}/admin/media/object?key=${encodeURIComponent(key)}`, {
    method: 'PUT',
    headers: {
      'content-type': request.headers.get('content-type') || 'application/octet-stream',
      'x-admin-session': sessionId,
    },
    body: await request.arrayBuffer(),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
    return NextResponse.json(
      { success: false, error: { message: payload?.error?.message || 'Storage rejected the upload.' } },
      { status: response.status }
    );
  }

  return new NextResponse(null, { status: 204 });
}
