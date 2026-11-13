function resolveSiteUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.SITE_URL?.trim() ||
    '';
  if (fromEnv) return fromEnv.replace(/\/+$/, '');
  return 'http://localhost:3000';
}

export const siteConfig = {
  name: 'Omega Calculators',
  description:
    'Comprehensive online tools platform featuring calculators, converters, PDF utilities, image tools, and developer utilities.',
  url: resolveSiteUrl(),
  defaultOgImage: '/images/logo/icon-with-bg.png',
  links: {
    github: 'https://github.com/mega-tools/platform',
  },
} as const;

export type SiteConfig = typeof siteConfig;
