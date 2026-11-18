import type { ToolPageDetail } from '@/tools/page-detail';
import { FhaLoanGuideArticle } from './FhaLoanGuideArticle';
import { FHA_LOAN_FAQS, FHA_LOAN_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate FHA down payment, base loan, upfront and monthly MIP, and total payment cost.',
  asideAriaLabel: 'Interactive FHA Loan Calculator',
  tocItems: FHA_LOAN_TOC_ITEMS,
  GuideArticle: FhaLoanGuideArticle,
  faqs: FHA_LOAN_FAQS,
  countryRules: null,
};
