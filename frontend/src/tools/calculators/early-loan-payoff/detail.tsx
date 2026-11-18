import type { ToolPageDetail } from '@/tools/page-detail';
import { EarlyLoanPayoffGuideArticle } from './EarlyLoanPayoffGuideArticle';
import { EARLY_LOAN_PAYOFF_FAQS, EARLY_LOAN_PAYOFF_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'See how extra monthly payments change payoff timing, interest cost, balances, and yearly repayment structure.',
  asideAriaLabel: 'Interactive Early Loan Payoff Calculator',
  tocItems: EARLY_LOAN_PAYOFF_TOC_ITEMS,
  GuideArticle: EarlyLoanPayoffGuideArticle,
  faqs: EARLY_LOAN_PAYOFF_FAQS,
  countryRules: null,
};
