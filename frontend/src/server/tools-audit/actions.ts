'use server';

import { classifyTools, type StoredAudit } from '@/lib/tools-audit/classify';
import { loadSourceIndex } from '@/lib/tools-audit/read-source';
import { ApiClientError, serverApi } from '@/server/api/client';
import type { ActionResult } from '@/server/auth/actions';
import { getAdminSessionToken } from '@/server/auth/session';

const AUDIT_TIMEOUT_MS = 120_000;

interface CatalogTool {
  id: string;
  name: string;
  slug: string;
  category: string;
  componentKey: string;
  isDeveloped: boolean;
  isDevelopedPersisted: boolean;
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

function capGroups<T extends { slugs: string[] }>(groups: T[]): T[] {
  return groups.slice(0, 100).map((group) => ({ ...group, slugs: group.slugs.slice(0, 50) }));
}

export async function getDevelopmentAuditAction(): Promise<ActionResult<StoredAudit | null>> {
  const headers = await authHeaders();
  if (!headers) return { success: false, error: 'Authentication session expired. Please sign in again.' };
  try {
    const response = await serverApi.get<{ report: StoredAudit | null }>('/admin/tools/development-audit', {
      headers,
      timeoutMs: AUDIT_TIMEOUT_MS,
    });
    return { success: true, data: response.data?.report ?? null };
  } catch (error) {
    return fail(error, 'Failed to load the saved audit.');
  }
}

export async function runDevelopmentAuditAction(): Promise<ActionResult<StoredAudit>> {
  const headers = await authHeaders();
  if (!headers) return { success: false, error: 'Authentication session expired. Please sign in again.' };

  try {
    const index = loadSourceIndex();
    if (!index.available) {
      return {
        success: false,
        error: 'Component source and the build-time manifest are unavailable, so isDeveloped was not changed.',
      };
    }

    const catalog = await serverApi.get<CatalogTool[]>('/admin/tools/development-audit/catalog', {
      headers,
      timeoutMs: AUDIT_TIMEOUT_MS,
    });
    if (!catalog.data) return { success: false, error: 'Failed to load the tool catalog.' };

    const classified = classifyTools(catalog.data, index);
    const saved = await serverApi.post<{ report: StoredAudit }>(
      '/admin/tools/development-audit',
      {
        source: classified.source,
        warning: classified.warning,
        totals: classified.totals,
        categories: classified.categories,
        duplicates: {
          ids: capGroups(classified.duplicates.ids),
          slugs: capGroups(classified.duplicates.slugs),
          routes: capGroups(classified.duplicates.routes),
          sharedComponents: capGroups(classified.duplicates.sharedComponents),
        },
        rows: classified.rows,
        updates: classified.updates,
        initializeIds: classified.initializeIds,
      },
      { headers, timeoutMs: AUDIT_TIMEOUT_MS }
    );

    if (!saved.data?.report) return { success: false, error: 'Failed to save the audit.' };
    return { success: true, data: saved.data.report };
  } catch (error) {
    return fail(error, 'The audit failed before isDeveloped could be saved.');
  }
}
