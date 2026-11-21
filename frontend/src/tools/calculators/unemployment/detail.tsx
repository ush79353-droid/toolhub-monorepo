import type { ToolPageDetail } from '@/tools/page-detail';
import { UNEMPLOYMENT_FAQS, UNEMPLOYMENT_TOC_ITEMS } from './content';
import { UnemploymentGuideArticle } from './UnemploymentGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate the unemployment rate from employed and unemployed people (or any two of employed, unemployed, and labor force), with optional labor-force participation.',
  asideAriaLabel: 'Interactive Unemployment Calculator',
  tocItems: UNEMPLOYMENT_TOC_ITEMS,
  GuideArticle: UnemploymentGuideArticle,
  faqs: UNEMPLOYMENT_FAQS,
  countryRules: null,
};
