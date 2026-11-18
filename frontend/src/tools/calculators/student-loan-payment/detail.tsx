import type { ToolPageDetail } from '@/tools/page-detail';
import { StudentLoanPaymentGuideArticle } from './StudentLoanPaymentGuideArticle';
import {
  STUDENT_LOAN_PAYMENT_FAQS,
  STUDENT_LOAN_PAYMENT_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate student loan payments, fee-inclusive totals, APR, and effective APR with prepaid, loaned, and origination fees.',
  asideAriaLabel: 'Interactive Student Loan Payment Calculator',
  tocItems: STUDENT_LOAN_PAYMENT_TOC_ITEMS,
  GuideArticle: StudentLoanPaymentGuideArticle,
  faqs: STUDENT_LOAN_PAYMENT_FAQS,
  countryRules: null,
};
