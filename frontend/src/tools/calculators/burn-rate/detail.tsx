import type { ToolPageDetail } from '@/tools/page-detail';
import { BurnRateGuideArticle } from './BurnRateGuideArticle';
import { BURN_RATE_FAQS, BURN_RATE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate monthly burn rate and cash runway from an initial balance, final balance, and duration.',
  asideAriaLabel: 'Interactive burn rate calculator',
  tocItems: BURN_RATE_TOC_ITEMS,
  GuideArticle: BurnRateGuideArticle,
  faqs: BURN_RATE_FAQS,
  countryRules: null,
};
