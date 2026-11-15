import type { MetadataRoute } from 'next';
import { getPublicSiteOrigin } from '@/server/seo/public-site';

export default function robots(): MetadataRoute.Robots {
  const origin = getPublicSiteOrigin().replace(/\/+$/, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/embed/', '/tools-audit'],
      },
    ],
    sitemap: origin ? `${origin}/sitemap.xml` : undefined,
    host: origin || undefined,
  };
}
