import type { ToolPageDetail } from '@/tools/page-detail';
import { InterestRateParityGuideArticle } from './InterestRateParityGuideArticle';
import {
  INTEREST_RATE_PARITY_FAQS,
  INTEREST_RATE_PARITY_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate covered forwards or uncovered expected future spots from interest rate parity with quote-currency FX controls.',
  asideAriaLabel: 'Interactive Interest Rate Parity Calculator',
  tocItems: INTEREST_RATE_PARITY_TOC_ITEMS,
  GuideArticle: InterestRateParityGuideArticle,
  faqs: INTEREST_RATE_PARITY_FAQS,
  countryRules: null,
};
