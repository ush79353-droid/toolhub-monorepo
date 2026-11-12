'use server';

import { serverApi, ApiClientError } from '@/server/api/client';
import { getAdminSessionToken } from '@/server/auth/session';
import type { ActionResult } from '@/server/auth/actions';

export interface MediaAsset {
  id: string;
  fileName: string;
  fileType: string;
  size: number;
  width: number | null;
  height: number | null;
  altText: string;
  url: string;
  createdAt: string;
}

export interface MediaList {
  items: MediaAsset[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MediaUploadTicket {
  driver: 'local' | 's3';
  uploadUrl: string;
  key: string;
  contentType: string;
  publicUrl: string;
}

async function authHeaders(): Promise<Record<string, string> | null> {
  const sessionId = await getAdminSessionToken();
  if (!sessionId) return null;
  return { 'x-admin-session': sessionId };
}

function fail(error: unknown, fallback: string): ActionResult<never> {
  if (error instanceof ApiClientError) return { success: false, error: error.message };
  return { success: false, error: fallback };
}

export async function listMediaAction(query: {
  page: number;
  limit?: number;
  search?: string;
  type?: string;
}): Promise<ActionResult<MediaList>> {
  const headers = await authHeaders();
  if (!headers) return { success: false, error: 'Authentication session expired. Please sign in again.' };
  try {
    const response = await serverApi.get<MediaList>('/admin/media', {
      headers,
      params: {
        page: query.page,
        limit: query.limit ?? 24,
        search: query.search || undefined,
        type: query.type || undefined,
      },
    });
    if (!response.success || !response.data) {
      return { success: false, error: response.error?.message || 'Failed to load media.' };
    }
    return { success: true, data: response.data };
  } catch (error) {
    return fail(error, 'Failed to load media.');
  }
}

export async function requestMediaUploadAction(payload: {
  fileName: string;
  contentType: string;
  size: number;
}): Promise<ActionResult<MediaUploadTicket>> {
  const headers = await authHeaders();
  if (!headers) return { success: false, error: 'Authentication session expired. Please sign in again.' };
  try {
    const response = await serverApi.post<MediaUploadTicket>('/admin/media/upload-url', payload, { headers });
    if (!response.success || !response.data) {
      return { success: false, error: response.error?.message || 'Failed to start upload.' };
    }
    return { success: true, data: response.data };
  } catch (error) {
    return fail(error, 'Failed to start upload.');
  }
}

export async function confirmMediaUploadAction(payload: {
  key: string;
  fileName: string;
  contentType: string;
  width?: number;
  height?: number;
}): Promise<ActionResult<MediaAsset>> {
  const headers = await authHeaders();
  if (!headers) return { success: false, error: 'Authentication session expired. Please sign in again.' };
  try {
    const response = await serverApi.post<MediaAsset>('/admin/media', payload, { headers });
    if (!response.success || !response.data) {
      return { success: false, error: response.error?.message || 'Failed to save the asset.' };
    }
    return { success: true, data: response.data };
  } catch (error) {
    return fail(error, 'Failed to save the asset.');
  }
}

export async function deleteMediaAction(id: string): Promise<ActionResult<{ id: string }>> {
  const headers = await authHeaders();
  if (!headers) return { success: false, error: 'Authentication session expired. Please sign in again.' };
  try {
    const response = await serverApi.delete<{ id: string }>(`/admin/media/${id}`, { headers });
    if (!response.success) {
      return { success: false, error: response.error?.message || 'Failed to delete the asset.' };
    }
    return { success: true, data: response.data };
  } catch (error) {
    return fail(error, 'Failed to delete the asset.');
  }
}
