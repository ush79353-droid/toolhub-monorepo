'use server';

import { serverApi, ApiClientError } from '@/server/api/client';
import { getAdminSessionToken } from '@/server/auth/session';
import type { ActionResult } from '@/server/auth/actions';
import type { ToolExecutionType } from '@/types/tool';

export interface ToolRef {
  id: string;
  name: string;
  slug: string;
}

export interface ToolRecord {
  id: string;
  name: string;
  slug: string;
  category: ToolRef | null;
  pillar: ToolRef | null;
  subPillar: ToolRef | null;
  iconMediaId: string | null;
  iconUrl: string;
  executionType: ToolExecutionType;
  componentKey: string;
  shortDescription: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  keywords: string;
  indexable: boolean;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ToolList {
  items: ToolRecord[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PlacementNode {
  id: string;
  name: string;
  kind: 'category' | 'pillar' | 'sub_pillar';
  parentId: string | null;
}

export interface ToolPayload {
  name: string;
  slug: string;
  categoryId: string;
  pillarId: string;
  subPillarId?: string | null;
  iconMediaId?: string | null;
  executionType?: ToolExecutionType;
  componentKey?: string;
  shortDescription?: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  keywords?: string;
  indexable?: boolean;
  isActive?: boolean;
  isFeatured?: boolean;
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

export async function listToolsAction(query: {
  page: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  status?: string;
  sort?: 'name' | 'updatedAt';
  order?: 'asc' | 'desc';
}): Promise<ActionResult<ToolList>> {
  const headers = await authHeaders();
  if (!headers) return { success: false, error: 'Authentication session expired. Please sign in again.' };
  try {
    const response = await serverApi.get<ToolList>('/admin/tools', {
      headers,
      params: {
        page: query.page,
        limit: query.limit ?? 10,
        search: query.search || undefined,
        categoryId: query.categoryId || undefined,
        status: query.status || undefined,
        sort: query.sort,
        order: query.order,
      },
    });
    if (!response.success || !response.data) {
      return { success: false, error: response.error?.message || 'Failed to load tools.' };
    }
    return { success: true, data: response.data };
  } catch (error) {
    return fail(error, 'Failed to load tools.');
  }
}

export async function listToolPlacementAction(): Promise<ActionResult<PlacementNode[]>> {
  const headers = await authHeaders();
  if (!headers) return { success: false, error: 'Authentication session expired. Please sign in again.' };
  try {
    const response = await serverApi.get<PlacementNode[]>('/admin/tools/placement', { headers });
    if (!response.success || !response.data) {
      return { success: false, error: response.error?.message || 'Failed to load categories.' };
    }
    return { success: true, data: response.data };
  } catch (error) {
    return fail(error, 'Failed to load categories.');
  }
}

export async function getToolAction(id: string): Promise<ActionResult<ToolRecord>> {
  const headers = await authHeaders();
  if (!headers) return { success: false, error: 'Authentication session expired. Please sign in again.' };
  try {
    const response = await serverApi.get<ToolRecord>(`/admin/tools/${id}`, { headers });
    if (!response.success || !response.data) {
      return { success: false, error: response.error?.message || 'Tool not found.' };
    }
    return { success: true, data: response.data };
  } catch (error) {
    return fail(error, 'Tool not found.');
  }
}

export async function saveToolAction(id: string | null, payload: ToolPayload): Promise<ActionResult<ToolRecord>> {
  const headers = await authHeaders();
  if (!headers) return { success: false, error: 'Authentication session expired. Please sign in again.' };
  try {
    const response = id
      ? await serverApi.patch<ToolRecord>(`/admin/tools/${id}`, payload, { headers })
      : await serverApi.post<ToolRecord>('/admin/tools', payload, { headers });
    if (!response.success || !response.data) {
      return { success: false, error: response.error?.message || 'Failed to save the tool.' };
    }
    return { success: true, data: response.data };
  } catch (error) {
    return fail(error, 'Failed to save the tool.');
  }
}

export async function deleteToolAction(id: string): Promise<ActionResult<{ id: string }>> {
  const headers = await authHeaders();
  if (!headers) return { success: false, error: 'Authentication session expired. Please sign in again.' };
  try {
    const response = await serverApi.delete<{ id: string }>(`/admin/tools/${id}`, { headers });
    if (!response.success) return { success: false, error: response.error?.message || 'Failed to delete the tool.' };
    return { success: true, data: response.data };
  } catch (error) {
    return fail(error, 'Failed to delete the tool.');
  }
}
