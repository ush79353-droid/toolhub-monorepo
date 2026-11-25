import 'server-only';
import { cache } from 'react';
import { serverApi } from '@/server/api/client';
import { getPublicSiteOrigin } from '@/server/seo/public-site';
import { isSiteIndexingEnabled } from '@/server/seo/site-indexing';
import {
  prepareSitemapCategories,
  sitemapIndexFiles,
  type RawSitemapCategory,
  type SitemapCategoryNode,
} from '@/lib/seo/sitemap-tree';
import { isRegisteredComponentKey } from '@/tools/registry/keys';

/** Production stays empty until indexing is on and the origin is public. Dev still renders localhost. */
export function sitemapOrigin(): string | null {
  const origin = getPublicSiteOrigin().replace(/\/+$/, '');
  if (!origin) return null;
  const local = origin.includes('localhost') || origin.includes('127.0.0.1');
  if (process.env.NODE_ENV === 'production' && (!isSiteIndexingEnabled() || local)) return null;
  return origin;
}

export interface SitemapHub {
  slug: string;
  updatedAt: string | null;
}

export interface SitemapCatalog {
  hubs: SitemapHub[];
  categories: SitemapCategoryNode[];
}

interface SitemapPayload {
  hubs?: SitemapHub[];
  categories?: RawSitemapCategory[];
}

export const getSitemapCatalog = cache(async (): Promise<SitemapCatalog> => {
  try {
    const response = await serverApi.get<SitemapPayload>('/catalog/sitemap', {
      cache: 'no-store',
      timeoutMs: 30_000,
    });
    const data = response.data ?? {};
    return {
      hubs: (data.hubs ?? []).filter((hub) => hub.slug),
      categories: prepareSitemapCategories(data.categories ?? [], (tool) => isRegisteredComponentKey(tool.componentKey)),
    };
  } catch {
    return { hubs: [], categories: [] };
  }
});

export function catalogIndexFiles(catalog: SitemapCatalog): string[] {
  return sitemapIndexFiles(catalog.categories);
}
