import type { ToolPageDetail } from '@/tools/page-detail';
import { StudentLoanRepaymentCovidGuideArticle } from './StudentLoanRepaymentCovidGuideArticle';
import {
  STUDENT_LOAN_REPAYMENT_COVID_FAQS,
  STUDENT_LOAN_REPAYMENT_COVID_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Historical COVID-era federal student loan payment suspension notice. Not an active repayment calculator.',
  asideAriaLabel: 'Historical COVID student loan repayment notice',
  tocItems: STUDENT_LOAN_REPAYMENT_COVID_TOC_ITEMS,
  GuideArticle: StudentLoanRepaymentCovidGuideArticle,
  faqs: STUDENT_LOAN_REPAYMENT_COVID_FAQS,
};
