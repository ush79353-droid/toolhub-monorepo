import type { ToolPageDetail } from '@/tools/page-detail';
import { MarginInterestGuideArticle } from './MarginInterestGuideArticle';
import { MARGIN_INTEREST_FAQS, MARGIN_INTEREST_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate simple margin-loan interest on a 360-day year from amount, rate, and days.',
  asideAriaLabel: 'Interactive Margin Interest Calculator',
  tocItems: MARGIN_INTEREST_TOC_ITEMS,
  GuideArticle: MarginInterestGuideArticle,
  faqs: MARGIN_INTEREST_FAQS,
  countryRules: null,
};
