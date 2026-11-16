import type { ToolPageDetail } from '@/tools/page-detail';
import { MortgageRateGuideArticle } from './MortgageRateGuideArticle';
import { MORTGAGE_RATE_FAQS, MORTGAGE_RATE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate fixed-rate mortgage payments and fee-adjusted APR from points, up-front, and annual fees.',
  asideAriaLabel: 'Interactive Mortgage Rate Calculator',
  tocItems: MORTGAGE_RATE_TOC_ITEMS,
  GuideArticle: MortgageRateGuideArticle,
  faqs: MORTGAGE_RATE_FAQS,
  countryRules: null,
};
