import type { ToolPageDetail } from '@/tools/page-detail';
import { LoanRepaymentGuideArticle } from './LoanRepaymentGuideArticle';
import { LOAN_REPAYMENT_FAQS, LOAN_REPAYMENT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate monthly repayment, total interest, early payoff savings, balances, and yearly repayment structure.',
  asideAriaLabel: 'Interactive Loan Repayment Calculator',
  tocItems: LOAN_REPAYMENT_TOC_ITEMS,
  GuideArticle: LoanRepaymentGuideArticle,
  faqs: LOAN_REPAYMENT_FAQS,
  countryRules: null,
};
