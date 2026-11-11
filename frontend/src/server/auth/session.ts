import 'server-only';
import { cookies } from 'next/headers';
import { serverApi, ApiClientError } from '@/server/api/client';
import type { AdminUser } from '@/types';

export const ADMIN_SESSION_COOKIE_NAME = 'admin_session';

/**
 * Returns the active session token from HttpOnly cookies
 */
export async function getAdminSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;
}

/**
 * Sets an opaque, secure, HttpOnly session cookie on the browser
 */
export async function setAdminSessionCookie(sessionId: string, rememberMe = false): Promise<void> {
  const cookieStore = await cookies();
  const maxAge = rememberMe
    ? 7 * 24 * 60 * 60 // 7 days in seconds
    : 24 * 60 * 60; // 24 hours in seconds

  cookieStore.set(ADMIN_SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
}

/**
 * Clears the session cookie from the browser
 */
export async function deleteAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE_NAME);
}

/**
 * Validates the current session token with the authoritative Express backend
 * and returns the authenticated AdminUser or null if expired/invalid.
 */
export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const sessionId = await getAdminSessionToken();

  if (!sessionId) {
    return null;
  }

  try {
    const response = await serverApi.get<AdminUser>('/admin/auth/me', {
      headers: {
        'x-admin-session': sessionId,
      },
      cache: 'no-store',
    });

    if (!response.success || !response.data) {
      await deleteAdminSessionCookie();
      return null;
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiClientError && (error.status === 401 || error.status === 403)) {
      // Session revoked or expired on backend
      try {
        await deleteAdminSessionCookie();
      } catch {
        // May be called in read-only RSC context
      }
    }
    return null;
  }
}
