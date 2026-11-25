import { sitemapIndex } from '@/lib/seo/sitemap-xml';
import { catalogIndexFiles, getSitemapCatalog, sitemapOrigin } from '@/server/seo/sitemap';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<Response> {
  const origin = sitemapOrigin();
  const files = origin ? catalogIndexFiles(await getSitemapCatalog()) : [];
  const xml = sitemapIndex(files.map((file) => `${origin}/sitemap/${file}`));
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
