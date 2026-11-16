import type { ToolPageDetail } from '@/tools/page-detail';
import { StudentLoanGuideArticle } from './StudentLoanGuideArticle';
import { STUDENT_LOAN_FAQS, STUDENT_LOAN_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate your student loan monthly payment from balance, remaining term, and interest rate with real currency conversion.',
  asideAriaLabel: 'Interactive Student Loan Calculator',
  tocItems: STUDENT_LOAN_TOC_ITEMS,
  GuideArticle: StudentLoanGuideArticle,
  faqs: STUDENT_LOAN_FAQS,
  countryRules: null,
};
