import fs from 'node:fs';
import path from 'node:path';
import { GoogleAuth } from 'google-auth-library';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';

export const INDEXING_SCOPE = 'https://www.googleapis.com/auth/indexing';
export const INDEXING_ENDPOINT = 'https://indexing.googleapis.com/v3/urlNotifications:publish';

export const INDEXING_TYPES = ['URL_UPDATED', 'URL_DELETED'] as const;
export type IndexingNoticeType = (typeof INDEXING_TYPES)[number];

export interface IndexingNotice {
  url: string;
  type: IndexingNoticeType;
}

export type IndexingSkipReason = 'disabled' | 'missing_key';

export type IndexingResult =
  | { sent: false; reason: IndexingSkipReason }
  | { sent: true; url: string; type: IndexingNoticeType };

export interface IndexingDeps {
  enabled: boolean;
  keyFile: string;
  request: (keyFile: string, notice: IndexingNotice) => Promise<void>;
}

export function isIndexingNoticeType(value: string): value is IndexingNoticeType {
  return (INDEXING_TYPES as readonly string[]).includes(value);
}

/** Absolute https URL on a public host. Local origins are rejected. */
export function assertIndexableUrl(url: string): string {
  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    throw new Error('Indexing URL must be an absolute https URL.');
  }
  if (parsed.protocol !== 'https:') {
    throw new Error('Indexing URL must use https.');
  }
  const host = parsed.hostname.toLowerCase();
  if (host === 'localhost' || host === '127.0.0.1' || host === '::1' || host.endsWith('.local')) {
    throw new Error('Indexing URL must be a public host.');
  }
  return parsed.toString();
}

export function publicSiteOrigin(): string {
  return (env.PUBLIC_SITE_URL || env.SITE_URL).trim().replace(/\/+$/, '');
}

/** Public calculator URL: `{origin}/tools/{slug}`. */
export function toolIndexUrl(slug: string, origin = publicSiteOrigin()): string {
  const base = origin.trim().replace(/\/+$/, '');
  const clean = slug.trim().replace(/^\/+/, '');
  if (!base) throw new Error('PUBLIC_SITE_URL or SITE_URL is not set.');
  if (!clean) throw new Error('Tool slug is required.');
  return assertIndexableUrl(`${base}/tools/${clean}`);
}

export function resolveIndexingKeyFile(keyFile: string): string {
  const trimmed = keyFile.trim();
  if (!trimmed) throw new Error('GOOGLE_INDEXING_KEY_FILE is not set.');
  const resolved = path.isAbsolute(trimmed) ? trimmed : path.resolve(process.cwd(), trimmed);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Google indexing key file not found: ${resolved}`);
  }
  return resolved;
}

export async function sendIndexingNotice(
  notice: IndexingNotice,
  deps: IndexingDeps
): Promise<IndexingResult> {
  if (!deps.enabled) return { sent: false, reason: 'disabled' };
  if (!deps.keyFile.trim()) return { sent: false, reason: 'missing_key' };
  if (!isIndexingNoticeType(notice.type)) {
    throw new Error('Indexing type must be URL_UPDATED or URL_DELETED.');
  }
  const url = assertIndexableUrl(notice.url);
  const body: IndexingNotice = { url, type: notice.type };
  const keyFile = resolveIndexingKeyFile(deps.keyFile);
  await deps.request(keyFile, body);
  return { sent: true, url, type: notice.type };
}

async function requestWithServiceAccount(keyFile: string, notice: IndexingNotice): Promise<void> {
  const auth = new GoogleAuth({
    keyFile,
    scopes: [INDEXING_SCOPE],
  });
  const client = await auth.getClient();
  await client.request({
    url: INDEXING_ENDPOINT,
    method: 'POST',
    data: notice,
  });
}

/**
 * Submit one URL to the Google Indexing API.
 * Returns without calling Google while GOOGLE_INDEXING_ENABLED is false.
 * Publish and unpublish do not call this.
 */
export async function notifyGoogleIndex(
  url: string,
  type: IndexingNoticeType
): Promise<IndexingResult> {
  const result = await sendIndexingNotice(
    { url, type },
    {
      enabled: env.GOOGLE_INDEXING_ENABLED,
      keyFile: env.GOOGLE_INDEXING_KEY_FILE,
      request: requestWithServiceAccount,
    }
  );
  if (result.sent) {
    logger.info('Google indexing notification sent', { url: result.url, type: result.type });
  }
  return result;
}
