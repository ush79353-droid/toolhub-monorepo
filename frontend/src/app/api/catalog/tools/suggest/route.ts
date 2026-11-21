import { NextResponse } from 'next/server';
import { serverApi } from '@/server/api/client';

interface ToolSuggestion {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  categoryName: string;
}

/** Browser → Next.js → Express. Never call Express from the header client. */
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get('q')?.trim().slice(0, 80) ?? '';
  if (!q) {
    return NextResponse.json({ success: true, data: { items: [] as ToolSuggestion[] } });
  }

  try {
    const response = await serverApi.get<{ items: ToolSuggestion[] }>('/catalog/tools/suggest', {
      cache: 'no-store',
      params: { q },
    });
    return NextResponse.json({
      success: true,
      data: { items: response.data?.items ?? [] },
    });
  } catch {
    return NextResponse.json({ success: true, data: { items: [] as ToolSuggestion[] } });
  }
}
