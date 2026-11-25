import { STATIC_SITEMAP_ID, STATIC_SITEMAP_PAGES } from '@/config/static-sitemap';
import { sitemapIndex, sitemapUrlset, type SitemapUrl } from '@/lib/seo/sitemap-xml';
import { resolveSitemapPath } from '@/lib/seo/sitemap-tree';
import { getSitemapCatalog, sitemapOrigin } from '@/server/seo/sitemap';

export const dynamic = 'force-dynamic';

function xml(body: string, status = 200): Response {
  return new Response(body, {
    status,
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}

function partsFromPath(path: string[]): string[] | null {
  if (path.length === 0) return null;
  const parts = path.map((part) => decodeURIComponent(part));
  const last = parts[parts.length - 1] ?? '';
  if (!last.endsWith('.xml')) return null;
  parts[parts.length - 1] = last.slice(0, -'.xml'.length);
  if (parts.some((part) => part.length === 0)) return null;
  return parts;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> }
): Promise<Response> {
  const origin = sitemapOrigin();
  if (!origin) return xml(sitemapUrlset([]));

  const { path } = await context.params;
  const parts = partsFromPath(path);
  if (!parts) return xml(sitemapUrlset([]), 404);

  const catalog = await getSitemapCatalog();
  if (parts.length === 1 && parts[0] === STATIC_SITEMAP_ID) {
    const pages: SitemapUrl[] = STATIC_SITEMAP_PAGES.map((page) => ({
      url: `${origin}${page.path === '/' ? '' : page.path}`,
      lastModified: page.lastModified,
    }));
    for (const hub of catalog.hubs) {
      pages.push({
        url: `${origin}/categories/${hub.slug}`,
        lastModified: hub.updatedAt,
      });
    }
    return xml(sitemapUrlset(pages));
  }

  const match = resolveSitemapPath(catalog.categories, parts);
  if (match.kind === 'missing') return xml(sitemapUrlset([]), 404);
  if (match.kind === 'index') {
    return xml(sitemapIndex(match.files.map((file) => `${origin}/sitemap/${file}`)));
  }
  const pages: SitemapUrl[] = match.tools.map((tool) => ({
    url: `${origin}/tools/${tool.slug}`,
    lastModified: tool.publishedAt,
  }));
  for (const file of match.children) pages.push({ url: `${origin}/sitemap/${file}` });
  return xml(sitemapUrlset(pages));
}
