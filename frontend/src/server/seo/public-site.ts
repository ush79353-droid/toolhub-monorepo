import 'server-only';
import { siteConfig } from '@/config/site';
import { normalizeSiteOrigin } from '@/lib/seo/tool-seo';

/**
 * Public site origin for canonicals / JSON-LD.
 * Prefer NEXT_PUBLIC_SITE_URL or SITE_URL. Never invent a production domain.
 */
export function getPublicSiteOrigin(): string {
  return normalizeSiteOrigin(siteConfig.url) || siteConfig.url;
}
