import { env } from '../../config/env';
import type { KeywordFact } from './choose-keyword';
import type { SerpItem } from './seo.model';

const BASE = 'https://api.dataforseo.com';

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' ? (value as Record<string, unknown>) : null;
}

function asNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

async function postTask(path: string, task: Record<string, unknown>): Promise<unknown> {
  if (!env.DATAFORSEO_LOGIN || !env.DATAFORSEO_PASSWORD) {
    throw new Error('DataForSEO credentials are not configured.');
  }
  const auth = Buffer.from(`${env.DATAFORSEO_LOGIN}:${env.DATAFORSEO_PASSWORD}`).toString('base64');
  const response = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([task]),
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) {
    throw new Error(`DataForSEO HTTP ${response.status}`);
  }
  const body = (await response.json()) as { tasks?: { status_code?: number; status_message?: string; result?: unknown }[] };
  const resultTask = body.tasks?.[0];
  if (!resultTask || resultTask.status_code !== 20000) {
    throw new Error(resultTask?.status_message || 'DataForSEO task failed');
  }
  return resultTask.result ?? null;
}

export function parseKeywordIdeas(result: unknown): KeywordFact[] {
  const rows = Array.isArray(result) ? result : [];
  const first = asRecord(rows[0]);
  const items = Array.isArray(first?.items) ? first.items : [];
  const facts: KeywordFact[] = [];
  for (const item of items) {
    const row = asRecord(item);
    if (!row || typeof row.keyword !== 'string' || !row.keyword.trim()) continue;
    const info = asRecord(row.keyword_info);
    const props = asRecord(row.keyword_properties);
    facts.push({
      keyword: row.keyword.trim(),
      searchVolume: asNumber(info?.search_volume),
      difficulty: asNumber(props?.keyword_difficulty),
      cpc: asNumber(info?.cpc),
    });
  }
  return facts;
}

export function parseOrganicSerp(result: unknown): SerpItem[] {
  const rows = Array.isArray(result) ? result : [];
  const first = asRecord(rows[0]);
  const items = Array.isArray(first?.items) ? first.items : [];
  const organic: SerpItem[] = [];
  for (const item of items) {
    const row = asRecord(item);
    if (!row || row.type !== 'organic') continue;
    if (typeof row.title !== 'string' || typeof row.url !== 'string') continue;
    organic.push({
      title: row.title.trim().slice(0, 300),
      url: row.url.trim().slice(0, 500),
      position: organic.length + 1,
    });
    if (organic.length >= 10) break;
  }
  return organic;
}

export async function fetchKeywordIdeas(seed: string, locationCode: number, languageCode: string): Promise<unknown> {
  return postTask('/v3/dataforseo_labs/google/keyword_ideas/live', {
    keywords: [seed],
    location_code: locationCode,
    language_code: languageCode,
    limit: 20,
    include_serp_info: false,
  });
}

export async function fetchOrganicSerp(
  keyword: string,
  locationCode: number,
  languageCode: string
): Promise<unknown> {
  return postTask('/v3/serp/google/organic/live/advanced', {
    keyword,
    location_code: locationCode,
    language_code: languageCode,
    depth: 10,
  });
}
