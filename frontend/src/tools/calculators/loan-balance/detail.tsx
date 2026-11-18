import type { ToolPageDetail } from '@/tools/page-detail';
import { LoanBalanceGuideArticle } from './LoanBalanceGuideArticle';
import { LOAN_BALANCE_FAQS, LOAN_BALANCE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate outstanding principal on a fixed-rate amortizing loan after a given period.',
  asideAriaLabel: 'Interactive Loan Balance Calculator',
  tocItems: LOAN_BALANCE_TOC_ITEMS,
  GuideArticle: LoanBalanceGuideArticle,
  faqs: LOAN_BALANCE_FAQS,
  countryRules: null,
};
