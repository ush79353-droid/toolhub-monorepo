import type { ToolPageDetail } from '@/tools/page-detail';
import { MortgageInterestGuideArticle } from './MortgageInterestGuideArticle';
import { MORTGAGE_INTEREST_FAQS, MORTGAGE_INTEREST_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate fixed-rate mortgage interest, monthly payment, and fee-adjusted APR with repayment charts.',
  asideAriaLabel: 'Interactive Mortgage Interest Calculator',
  tocItems: MORTGAGE_INTEREST_TOC_ITEMS,
  GuideArticle: MortgageInterestGuideArticle,
  faqs: MORTGAGE_INTEREST_FAQS,
  countryRules: null,
};
