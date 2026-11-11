'use server';

import { redirect } from 'next/navigation';
import { serverApi, ApiClientError } from '@/server/api/client';
import { setAdminSessionCookie, deleteAdminSessionCookie, getAdminSessionToken } from './session';
import type { AdminUser, AuthLoginResponse } from '@/types';

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Server Action: Authenticate administrator against Express backend
 */
export async function loginAdminAction(payload: {
  email: string;
  password: string;
  rememberMe?: boolean;
}): Promise<ActionResult<AdminUser>> {
  try {
    const response = await serverApi.post<AuthLoginResponse>('/admin/auth/login', payload);

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error?.message || 'Authentication failed. Please verify your credentials.',
      };
    }

    // Set secure HttpOnly session cookie
    await setAdminSessionCookie(response.data.sessionId, payload.rememberMe);

    return {
      success: true,
      data: response.data.user,
    };
  } catch (error) {
    if (error instanceof ApiClientError) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: 'An unexpected connection error occurred. Please try again.',
    };
  }
}

/**
 * Server Action: Invalidate session on Express backend and delete session cookie
 */
export async function logoutAdminAction(): Promise<void> {
  const sessionId = await getAdminSessionToken();

  if (sessionId) {
    try {
      await serverApi.post('/admin/auth/logout', undefined, {
        headers: {
          'x-admin-session': sessionId,
        },
      });
    } catch {
      // Invalidate cookie regardless of network result
    }
  }

  await deleteAdminSessionCookie();
  redirect('/admin/login');
}

/**
 * Server Action: Update profile information (name)
 */
export async function updateAdminProfileAction(payload: {
  name: string;
}): Promise<ActionResult<AdminUser>> {
  const sessionId = await getAdminSessionToken();

  if (!sessionId) {
    return {
      success: false,
      error: 'Authentication session expired. Please sign in again.',
    };
  }

  try {
    const response = await serverApi.patch<AdminUser>('/admin/auth/profile', payload, {
      headers: {
        'x-admin-session': sessionId,
      },
    });

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error?.message || 'Failed to update profile.',
      };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (error instanceof ApiClientError) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: 'Failed to update profile. Server unreachable.',
    };
  }
}

/**
 * Server Action: Change admin password & revoke session
 */
export async function changeAdminPasswordAction(payload: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<ActionResult<{ message: string }>> {
  const sessionId = await getAdminSessionToken();

  if (!sessionId) {
    return {
      success: false,
      error: 'Authentication session expired. Please sign in again.',
    };
  }

  try {
    const response = await serverApi.post<{ message: string }>(
      '/admin/auth/change-password',
      payload,
      {
        headers: {
          'x-admin-session': sessionId,
        },
      }
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error?.message || 'Password update failed.',
      };
    }

    // Sessions revoked on backend; delete local session cookie
    await deleteAdminSessionCookie();

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (error instanceof ApiClientError) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: 'Failed to update password. Server unreachable.',
    };
  }
}

/**
 * Server Action: Request password reset link
 */
export async function forgotPasswordAction(payload: {
  email: string;
}): Promise<ActionResult<{ message: string }>> {
  try {
    const response = await serverApi.post<{ message: string }>(
      '/admin/auth/forgot-password',
      payload
    );

    return {
      success: true,
      data: response.data || {
        message: 'If an account exists with that email, a password reset link has been dispatched.',
      },
    };
  } catch (error) {
    if (error instanceof ApiClientError) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: 'Failed to dispatch password reset request.',
    };
  }
}

/**
 * Server Action: Complete password reset with token
 */
export async function resetPasswordAction(payload: {
  token: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<ActionResult<{ message: string }>> {
  try {
    const response = await serverApi.post<{ message: string }>(
      '/admin/auth/reset-password',
      payload
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error?.message || 'Failed to reset password.',
      };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (error instanceof ApiClientError) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: 'Failed to reset password. Please request a new reset link.',
    };
  }
}
