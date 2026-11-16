import type { ToolPageDetail } from '@/tools/page-detail';
import { BoatLoanGuideArticle } from './BoatLoanGuideArticle';
import { BOAT_LOAN_FAQS, BOAT_LOAN_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate boat loan monthly payments and total interest from amount, term, and annual rate.',
  asideAriaLabel: 'Interactive Boat Loan Calculator',
  tocItems: BOAT_LOAN_TOC_ITEMS,
  GuideArticle: BoatLoanGuideArticle,
  faqs: BOAT_LOAN_FAQS,
  countryRules: null,
};
