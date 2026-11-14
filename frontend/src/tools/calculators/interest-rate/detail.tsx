import type { ToolPageDetail } from '@/tools/page-detail';
import { InterestRateGuideArticle } from './InterestRateGuideArticle';
import { INTEREST_RATE_FAQS, INTEREST_RATE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Solve implied loan or deposit interest rates, EAR, and fee-adjusted APR from payments or balances.',
  asideAriaLabel: 'Interactive Interest Rate Calculator',
  tocItems: INTEREST_RATE_TOC_ITEMS,
  GuideArticle: InterestRateGuideArticle,
  faqs: INTEREST_RATE_FAQS,
  countryRules: null,
};
