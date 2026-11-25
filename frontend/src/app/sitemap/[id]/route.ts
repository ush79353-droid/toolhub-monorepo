import { STATIC_SITEMAP_ID, STATIC_SITEMAP_PAGES, UNASSIGNED_SITEMAP_ID } from '@/config/static-sitemap';
import { sitemapUrlset, type SitemapUrl } from '@/lib/seo/sitemap-xml';
import { getPublicSiteOrigin } from '@/server/seo/public-site';
import { isSiteIndexingEnabled } from '@/server/seo/site-indexing';
import { getSitemapCatalog } from '@/server/seo/sitemap';

export const dynamic = 'force-dynamic';

function originOrNull(): string | null {
  if (!isSiteIndexingEnabled()) return null;
  const origin = getPublicSiteOrigin().replace(/\/+$/, '');
  if (!origin || origin.includes('localhost')) return null;
  return origin;
}

function xml(entries: SitemapUrl[], status = 200): Response {
  return new Response(sitemapUrlset(entries), {
    status,
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  const origin = originOrNull();
  if (!origin) return xml([]);

  const { id: rawId } = await context.params;
  const id = decodeURIComponent(rawId).replace(/\.xml$/, '');
  const catalog = await getSitemapCatalog();

  if (id === STATIC_SITEMAP_ID) {
    const pages: SitemapUrl[] = STATIC_SITEMAP_PAGES.map((page) => ({
      url: `${origin}${page.path === '/' ? '' : page.path}`,
      lastModified: page.lastModified,
    }));
    for (const category of catalog.categories) {
      if (!category.slug) continue;
      pages.push({
        url: `${origin}/categories/${category.slug}`,
        lastModified: category.updatedAt,
      });
    }
    return xml(pages);
  }

  if (id === UNASSIGNED_SITEMAP_ID) {
    return xml(
      catalog.unassigned.map((tool) => ({
        url: `${origin}/tools/${tool.slug}`,
        lastModified: tool.publishedAt,
      }))
    );
  }

  const pillar = catalog.pillars.find((item) => item.sitemapId === id);
  if (!pillar) return xml([], 404);

  const entries: SitemapUrl[] = [];
  if (pillar.categorySlug) {
    entries.push({
      url: `${origin}/categories/${pillar.categorySlug}#${pillar.slug}`,
      lastModified: pillar.updatedAt,
    });
  }
  for (const tool of pillar.tools) {
    entries.push({
      url: `${origin}/tools/${tool.slug}`,
      lastModified: tool.publishedAt,
    });
  }
  return xml(entries);
}
