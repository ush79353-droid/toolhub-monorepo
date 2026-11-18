import type { ToolPageDetail } from '@/tools/page-detail';
import { RvLoanGuideArticle } from './RvLoanGuideArticle';
import { RV_LOAN_FAQS, RV_LOAN_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate RV loan principal, monthly payment, total paid, and financing cost with independent currency conversion on every money field.',
  asideAriaLabel: 'Interactive RV Loan Calculator',
  tocItems: RV_LOAN_TOC_ITEMS,
  GuideArticle: RvLoanGuideArticle,
  faqs: RV_LOAN_FAQS,
  countryRules: null,
};
