import type { ToolPageDetail } from '@/tools/page-detail';
import { CreditCardPaymentGuideArticle } from './CreditCardPaymentGuideArticle';
import {
  CREDIT_CARD_PAYMENT_FAQS,
  CREDIT_CARD_PAYMENT_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Find the monthly payment needed to pay off a credit card balance within a set term, with interest, payoff date, and real FX on money fields.',
  asideAriaLabel: 'Interactive Credit Card Payment Calculator',
  tocItems: CREDIT_CARD_PAYMENT_TOC_ITEMS,
  GuideArticle: CreditCardPaymentGuideArticle,
  faqs: CREDIT_CARD_PAYMENT_FAQS,
  countryRules: null,
};
