import type { ToolPageDetail } from '@/tools/page-detail';
import { DeferredPaymentLoanGuideArticle } from './DeferredPaymentLoanGuideArticle';
import {
  DEFERRED_PAYMENT_LOAN_FAQS,
  DEFERRED_PAYMENT_LOAN_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare original and deferred loan repayment: capitalized or separate interest, adjusted payments or term, and payoff dates.',
  asideAriaLabel: 'Interactive Deferred Payment Loan Calculator',
  tocItems: DEFERRED_PAYMENT_LOAN_TOC_ITEMS,
  GuideArticle: DeferredPaymentLoanGuideArticle,
  faqs: DEFERRED_PAYMENT_LOAN_FAQS,
  countryRules: null,
};
