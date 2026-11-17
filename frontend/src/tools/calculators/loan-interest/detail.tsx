import type { ToolPageDetail } from '@/tools/page-detail';
import { LoanInterestGuideArticle } from './LoanInterestGuideArticle';
import { LOAN_INTEREST_FAQS, LOAN_INTEREST_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate amortizing loan interest, total payment, and periodic repayment with independent FX and a yearly balances chart.',
  asideAriaLabel: 'Interactive Loan Interest Calculator',
  tocItems: LOAN_INTEREST_TOC_ITEMS,
  GuideArticle: LoanInterestGuideArticle,
  faqs: LOAN_INTEREST_FAQS,
  countryRules: null,
};
