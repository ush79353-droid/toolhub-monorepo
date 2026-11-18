import type { ToolPageDetail } from '@/tools/page-detail';
import { LoanPaymentGuideArticle } from './LoanPaymentGuideArticle';
import { LOAN_PAYMENT_FAQS, LOAN_PAYMENT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate amortizing loan payments by term and payment frequency, with independent FX on loan amount, periodic payment, and total.',
  asideAriaLabel: 'Interactive Loan Payment Calculator',
  tocItems: LOAN_PAYMENT_TOC_ITEMS,
  GuideArticle: LoanPaymentGuideArticle,
  faqs: LOAN_PAYMENT_FAQS,
  countryRules: null,
};
