import type { ToolPageDetail } from '@/tools/page-detail';
import { StudentLoanForgivenessGuideArticle } from './StudentLoanForgivenessGuideArticle';
import {
  STUDENT_LOAN_FORGIVENESS_FAQS,
  STUDENT_LOAN_FORGIVENESS_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Historical / Not Currently Available; capture screenshot fields for the blocked 2022 relief proposal form without inventing current forgiveness amounts.',
  asideAriaLabel: 'Interactive Student Loan Forgiveness Calculator',
  tocItems: STUDENT_LOAN_FORGIVENESS_TOC_ITEMS,
  GuideArticle: StudentLoanForgivenessGuideArticle,
  faqs: STUDENT_LOAN_FORGIVENESS_FAQS,
  countryRules: null,
};
