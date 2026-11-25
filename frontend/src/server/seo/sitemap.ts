import 'server-only';
import { cache } from 'react';
import { STATIC_SITEMAP_ID, UNASSIGNED_SITEMAP_ID, sitemapIdForPillar } from '@/config/static-sitemap';
import { serverApi } from '@/server/api/client';
import { isRegisteredComponentKey } from '@/tools/registry/keys';

export interface SitemapTool {
  slug: string;
  componentKey: string;
  publishedAt: string | null;
}

export interface SitemapPillar {
  slug: string;
  sitemapId: string;
  updatedAt: string | null;
  categorySlug: string;
  tools: SitemapTool[];
}

export interface SitemapCatalog {
  categories: { slug: string; updatedAt: string | null }[];
  pillars: SitemapPillar[];
  unassigned: SitemapTool[];
}

interface SitemapPayload {
  categories?: { slug: string; updatedAt: string | null }[];
  pillars?: {
    slug: string;
    updatedAt: string | null;
    categorySlug: string;
    tools: SitemapTool[];
  }[];
  unassigned?: SitemapTool[];
}

function liveTools(tools: SitemapTool[]): SitemapTool[] {
  return tools.filter((tool) => tool.slug && isRegisteredComponentKey(tool.componentKey));
}

export const getSitemapCatalog = cache(async (): Promise<SitemapCatalog> => {
  try {
    const response = await serverApi.get<SitemapPayload>('/catalog/sitemap', {
      cache: 'no-store',
      timeoutMs: 30_000,
    });
    const data = response.data ?? {};
    const pillars = (data.pillars ?? []).flatMap((pillar) => {
      const tools = liveTools(pillar.tools ?? []);
      if (!pillar.slug || tools.length === 0) return [];
      return [
        {
          slug: pillar.slug,
          sitemapId: sitemapIdForPillar(pillar.slug),
          updatedAt: pillar.updatedAt,
          categorySlug: pillar.categorySlug,
          tools,
        },
      ];
    });
    return {
      categories: data.categories ?? [],
      pillars,
      unassigned: liveTools(data.unassigned ?? []),
    };
  } catch {
    return { categories: [], pillars: [], unassigned: [] };
  }
});

export function sitemapFileIds(catalog: SitemapCatalog): string[] {
  const ids = [STATIC_SITEMAP_ID, ...catalog.pillars.map((pillar) => pillar.sitemapId)];
  if (catalog.unassigned.length > 0) ids.push(UNASSIGNED_SITEMAP_ID);
  return ids;
}
