'use server';

import { revalidatePath } from 'next/cache';
import { ApiClientError, serverApi } from '@/server/api/client';
import type { ActionResult } from '@/server/auth/actions';
import { getAdminSessionToken } from '@/server/auth/session';

export interface SeoContent {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  primaryKeyword: string;
  disclaimer: string;
  sections: Array<{
    id: string;
    title: string;
    paragraphs: string[];
    bullets: string[];
    formula: string;
    formulaNote: string;
  }>;
  faqs: Array<{ question: string; answer: string }>;
  links: Array<{ slug: string; anchor: string }>;
}

export interface SeoIssue {
  code: string;
  message: string;
  severity: 'block' | 'flag';
}

export interface SeoCallCounts {
  keyword: number;
  serp: number;
  openai: number;
}

export interface SeoCampaign {
  id: string;
  name: string;
  categoryId: string;
  maxTools: number;
  status: string;
  locationCode: number;
  languageCode: string;
  draftCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SeoEligibleTool {
  id: string;
  name: string;
  slug: string;
  pillarName: string;
}

export interface SeoDraftListItem {
  id: string;
  toolId: string;
  name: string;
  slug: string;
  status: string;
  primaryKeyword: string;
  error: string;
  callCounts: SeoCallCounts;
  validationOk: boolean;
}

export interface SeoDraftDetail extends SeoDraftListItem {
  campaignId: string;
  failedStep: string;
  snapshot: {
    name: string;
    slug: string;
    pillarName: string;
    shortDescription: string;
    componentKey: string;
    categorySlug: string;
  };
  secondaryKeywords: string[];
  keywordFacts: Array<{
    keyword: string;
    searchVolume: number | null;
    difficulty: number | null;
    cpc: number | null;
  }>;
  serpItems: Array<{ title: string; url: string; position: number }>;
  suggestedLinks: Array<{ slug: string; anchor: string }>;
  content: SeoContent | null;
  validation: { ok: boolean; issues: SeoIssue[] };
  locationCode: number;
  languageCode: string;
  reviewedAt: string | null;
  publishedAt: string | null;
  updatedAt: string;
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

function revalidatePublishedTool(slug?: string) {
  if (!slug) return;
  revalidatePath(`/tools/${slug}`);
  revalidatePath(`/embed/${slug}`);
}

export async function listSeoCampaignsAction(): Promise<ActionResult<SeoCampaign[]>> {
  const headers = await authHeaders();
  if (!headers) return { success: false, error: 'Authentication session expired. Please sign in again.' };
  try {
    const response = await serverApi.get<SeoCampaign[]>('/admin/seo/campaigns', { headers });
    if (!response.success || !response.data) return { success: false, error: 'Failed to load campaigns.' };
    return { success: true, data: response.data };
  } catch (error) {
    return fail(error, 'Failed to load campaigns.');
  }
}

export async function listEligibleSeoToolsAction(): Promise<ActionResult<SeoEligibleTool[]>> {
  const headers = await authHeaders();
  if (!headers) return { success: false, error: 'Authentication session expired. Please sign in again.' };
  try {
    const response = await serverApi.get<SeoEligibleTool[]>('/admin/seo/eligible-tools', { headers });
    if (!response.success || !response.data) return { success: false, error: 'Failed to load calculators.' };
    return { success: true, data: response.data };
  } catch (error) {
    return fail(error, 'Failed to load calculators.');
  }
}

export async function createSeoCampaignAction(input: {
  name: string;
  toolIds: string[];
}): Promise<ActionResult<{ campaign: SeoCampaign }>> {
  const headers = await authHeaders();
  if (!headers) return { success: false, error: 'Authentication session expired. Please sign in again.' };
  try {
    const response = await serverApi.post<{ campaign: SeoCampaign }>('/admin/seo/campaigns', input, { headers });
    if (!response.success || !response.data) return { success: false, error: 'Failed to create the campaign.' };
    return { success: true, data: response.data };
  } catch (error) {
    return fail(error, 'Failed to create the campaign.');
  }
}

export async function getSeoCampaignAction(
  id: string
): Promise<ActionResult<{ campaign: SeoCampaign; drafts: SeoDraftListItem[] }>> {
  const headers = await authHeaders();
  if (!headers) return { success: false, error: 'Authentication session expired. Please sign in again.' };
  try {
    const response = await serverApi.get<{ campaign: SeoCampaign; drafts: SeoDraftListItem[] }>(
      `/admin/seo/campaigns/${id}`,
      { headers }
    );
    if (!response.success || !response.data) return { success: false, error: 'Campaign was not found.' };
    return { success: true, data: response.data };
  } catch (error) {
    return fail(error, 'Campaign was not found.');
  }
}

export async function getSeoDraftAction(id: string): Promise<ActionResult<SeoDraftDetail>> {
  const headers = await authHeaders();
  if (!headers) return { success: false, error: 'Authentication session expired. Please sign in again.' };
  try {
    const response = await serverApi.get<SeoDraftDetail>(`/admin/seo/drafts/${id}`, { headers });
    if (!response.success || !response.data) return { success: false, error: 'Draft was not found.' };
    return { success: true, data: response.data };
  } catch (error) {
    return fail(error, 'Draft was not found.');
  }
}

export async function saveSeoDraftAction(id: string, content: SeoContent): Promise<ActionResult<SeoDraftDetail>> {
  const headers = await authHeaders();
  if (!headers) return { success: false, error: 'Authentication session expired. Please sign in again.' };
  try {
    const response = await serverApi.patch<SeoDraftDetail>(`/admin/seo/drafts/${id}`, { content }, { headers });
    if (!response.success || !response.data) return { success: false, error: 'Failed to save the draft.' };
    return { success: true, data: response.data };
  } catch (error) {
    return fail(error, 'Failed to save the draft.');
  }
}

export async function approveSeoDraftAction(id: string): Promise<ActionResult<SeoDraftDetail>> {
  const headers = await authHeaders();
  if (!headers) return { success: false, error: 'Authentication session expired. Please sign in again.' };
  try {
    const response = await serverApi.post<SeoDraftDetail>(`/admin/seo/drafts/${id}/approve`, {}, { headers });
    if (!response.success || !response.data) return { success: false, error: 'Failed to approve the draft.' };
    return { success: true, data: response.data };
  } catch (error) {
    return fail(error, 'Failed to approve the draft.');
  }
}

export async function publishSeoDraftAction(id: string): Promise<ActionResult<SeoDraftDetail>> {
  const headers = await authHeaders();
  if (!headers) return { success: false, error: 'Authentication session expired. Please sign in again.' };
  try {
    const response = await serverApi.post<{ draft: SeoDraftDetail; slug: string }>(
      `/admin/seo/drafts/${id}/publish`,
      {},
      { headers }
    );
    if (!response.success || !response.data) return { success: false, error: 'Failed to publish the draft.' };
    revalidatePublishedTool(response.data.slug);
    return { success: true, data: response.data.draft };
  } catch (error) {
    return fail(error, 'Failed to publish the draft.');
  }
}

export async function unpublishSeoDraftAction(id: string): Promise<ActionResult<SeoDraftDetail>> {
  const headers = await authHeaders();
  if (!headers) return { success: false, error: 'Authentication session expired. Please sign in again.' };
  try {
    const response = await serverApi.post<{ draft: SeoDraftDetail; slug: string }>(
      `/admin/seo/drafts/${id}/unpublish`,
      {},
      { headers }
    );
    if (!response.success || !response.data) return { success: false, error: 'Failed to unpublish the draft.' };
    revalidatePublishedTool(response.data.slug);
    return { success: true, data: response.data.draft };
  } catch (error) {
    return fail(error, 'Failed to unpublish the draft.');
  }
}

export async function regenerateSeoDraftAction(
  id: string,
  researchAgain: boolean
): Promise<ActionResult<SeoDraftDetail>> {
  const headers = await authHeaders();
  if (!headers) return { success: false, error: 'Authentication session expired. Please sign in again.' };
  try {
    const response = await serverApi.post<SeoDraftDetail>(
      `/admin/seo/drafts/${id}/regenerate`,
      { researchAgain },
      { headers }
    );
    if (!response.success || !response.data) return { success: false, error: 'Failed to regenerate the draft.' };
    return { success: true, data: response.data };
  } catch (error) {
    return fail(error, 'Failed to regenerate the draft.');
  }
}

export async function retrySeoDraftAction(id: string): Promise<ActionResult<SeoDraftDetail>> {
  const headers = await authHeaders();
  if (!headers) return { success: false, error: 'Authentication session expired. Please sign in again.' };
  try {
    const response = await serverApi.post<SeoDraftDetail>(`/admin/seo/drafts/${id}/retry`, {}, { headers });
    if (!response.success || !response.data) return { success: false, error: 'Failed to retry the draft.' };
    return { success: true, data: response.data };
  } catch (error) {
    return fail(error, 'Failed to retry the draft.');
  }
}
