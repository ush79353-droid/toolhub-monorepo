import 'server-only';
import { isSiteIndexingEnabled as readIndexingFlag } from '@/lib/seo/tool-seo';

/**
 * Site-wide indexing kill switch.
 * Set SITE_ALLOW_INDEXING=true only when the public site is ready for search engines.
 * Unset or any other value keeps robots/sitemap/meta at noindex.
 */
export function isSiteIndexingEnabled(): boolean {
  return readIndexingFlag();
}
