'use server';

import { serverApi, ApiClientError } from '@/server/api/client';
import { getAdminSessionToken } from '@/server/auth/session';
import type { ActionResult } from '@/server/auth/actions';

export type CategoryKind = 'category' | 'pillar' | 'sub_pillar';

export interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  kind: CategoryKind;
  parentId: string | null;
  sortOrder: number;
  description: string;
  iconUrl: string;
  isActive: boolean;
  children: CategoryNode[];
}

export interface CategoryList {
  items: CategoryNode[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CategoryOption {
  id: string;
  name: string;
  kind: CategoryKind;
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

export async function listCategoriesAction(query: {
  page: number;
  limit?: number;
  search?: string;
}): Promise<ActionResult<CategoryList>> {
  const headers = await authHeaders();
  if (!headers) return { success: false, error: 'Authentication session expired. Please sign in again.' };
  try {
    const response = await serverApi.get<CategoryList>('/admin/categories', {
      headers,
      params: {
        page: query.page,
        limit: query.limit ?? 10,
        search: query.search || undefined,
      },
    });
    if (!response.success || !response.data) {
      return { success: false, error: response.error?.message || 'Failed to load categories.' };
    }
    return { success: true, data: response.data };
  } catch (error) {
    return fail(error, 'Failed to load categories.');
  }
}

export async function getCategoryAction(id: string): Promise<ActionResult<CategoryNode>> {
  const headers = await authHeaders();
  if (!headers) return { success: false, error: 'Authentication session expired. Please sign in again.' };
  try {
    const response = await serverApi.get<CategoryNode>(`/admin/categories/${id}`, { headers });
    if (!response.success || !response.data) {
      return { success: false, error: response.error?.message || 'Category not found.' };
    }
    return { success: true, data: response.data };
  } catch (error) {
    return fail(error, 'Category not found.');
  }
}

export async function listCategoryOptionsAction(): Promise<ActionResult<CategoryOption[]>> {
  const headers = await authHeaders();
  if (!headers) return { success: false, error: 'Authentication session expired. Please sign in again.' };
  try {
    const response = await serverApi.get<CategoryOption[]>('/admin/categories/options', { headers });
    if (!response.success || !response.data) {
      return { success: false, error: response.error?.message || 'Failed to load parents.' };
    }
    return { success: true, data: response.data };
  } catch (error) {
    return fail(error, 'Failed to load parents.');
  }
}

export async function createCategoryAction(payload: {
  name: string;
  slug: string;
  kind: CategoryKind;
  parentId?: string | null;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}): Promise<ActionResult<CategoryNode>> {
  const headers = await authHeaders();
  if (!headers) return { success: false, error: 'Authentication session expired. Please sign in again.' };
  try {
    const response = await serverApi.post<CategoryNode>('/admin/categories', payload, { headers });
    if (!response.success || !response.data) {
      return { success: false, error: response.error?.message || 'Failed to create category.' };
    }
    return { success: true, data: response.data };
  } catch (error) {
    return fail(error, 'Failed to create category.');
  }
}

export async function updateCategoryAction(
  id: string,
  payload: {
    name: string;
    slug: string;
    description?: string;
    sortOrder?: number;
    isActive?: boolean;
  }
): Promise<ActionResult<CategoryNode>> {
  const headers = await authHeaders();
  if (!headers) return { success: false, error: 'Authentication session expired. Please sign in again.' };
  try {
    const response = await serverApi.patch<CategoryNode>(`/admin/categories/${id}`, payload, { headers });
    if (!response.success || !response.data) {
      return { success: false, error: response.error?.message || 'Failed to update category.' };
    }
    return { success: true, data: response.data };
  } catch (error) {
    return fail(error, 'Failed to update category.');
  }
}

export async function deleteCategoryAction(id: string): Promise<ActionResult<{ deleted: number }>> {
  const headers = await authHeaders();
  if (!headers) return { success: false, error: 'Authentication session expired. Please sign in again.' };
  try {
    const response = await serverApi.delete<{ deleted: number }>(`/admin/categories/${id}`, { headers });
    if (!response.success || !response.data) {
      return { success: false, error: response.error?.message || 'Failed to delete category.' };
    }
    return { success: true, data: response.data };
  } catch (error) {
    return fail(error, 'Failed to delete category.');
  }
}
