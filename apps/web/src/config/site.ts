export const siteConfig = {
  name: 'Mega Tools',
  description:
    'Comprehensive online tools platform featuring calculators, converters, PDF utilities, image tools, and developer utilities.',
  url: 'http://localhost:3000',
  links: {
    github: 'https://github.com/mega-tools/platform',
  },
} as const;

export type SiteConfig = typeof siteConfig;

