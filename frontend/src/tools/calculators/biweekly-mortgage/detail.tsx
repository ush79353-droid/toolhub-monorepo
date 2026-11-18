import type { ToolPageDetail } from '@/tools/page-detail';
import { BiweeklyMortgageGuideArticle } from './BiweeklyMortgageGuideArticle';
import { BIWEEKLY_MORTGAGE_FAQS, BIWEEKLY_MORTGAGE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare standard monthly mortgage payments with accelerated biweekly payments, including compounding, points, fees, and real FX.',
  asideAriaLabel: 'Interactive Biweekly Mortgage Calculator',
  tocItems: BIWEEKLY_MORTGAGE_TOC_ITEMS,
  GuideArticle: BiweeklyMortgageGuideArticle,
  faqs: BIWEEKLY_MORTGAGE_FAQS,
  countryRules: null,
};
