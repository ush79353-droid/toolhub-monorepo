import type { ToolPageDetail } from '@/tools/page-detail';
import { BusinessLoanGuideArticle } from './BusinessLoanGuideArticle';
import { BUSINESS_LOAN_FAQS, BUSINESS_LOAN_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate commercial business loan monthly payments, total interest, finance charges, and true APR including origination, loaned, and prepaid closing fees.',
  asideAriaLabel: 'Interactive Business Loan Calculator',
  tocItems: BUSINESS_LOAN_TOC_ITEMS,
  GuideArticle: BusinessLoanGuideArticle,
  faqs: BUSINESS_LOAN_FAQS,
};
