import type { ToolPageDetail } from '@/tools/page-detail';
import { CompoundInterestRateGuideArticle } from './CompoundInterestRateGuideArticle';
import {
  COMPOUND_INTEREST_RATE_FAQS,
  COMPOUND_INTEREST_RATE_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Find the annual nominal compound interest rate from an initial balance, final balance, compounding frequency, and term.',
  asideAriaLabel: 'Interactive compound interest rate calculator',
  tocItems: COMPOUND_INTEREST_RATE_TOC_ITEMS,
  GuideArticle: CompoundInterestRateGuideArticle,
  faqs: COMPOUND_INTEREST_RATE_FAQS,
  countryRules: null,
};
