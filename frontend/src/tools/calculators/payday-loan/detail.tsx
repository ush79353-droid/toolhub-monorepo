import type { ToolPageDetail } from '@/tools/page-detail';
import { PaydayLoanGuideArticle } from './PaydayLoanGuideArticle';
import { PAYDAY_LOAN_FAQS, PAYDAY_LOAN_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate payday loan APR, annualized finance charge, monthly fee, and total debt with real currency conversion.',
  asideAriaLabel: 'Interactive Payday Loan Calculator',
  tocItems: PAYDAY_LOAN_TOC_ITEMS,
  GuideArticle: PaydayLoanGuideArticle,
  faqs: PAYDAY_LOAN_FAQS,
  countryRules: null,
};
