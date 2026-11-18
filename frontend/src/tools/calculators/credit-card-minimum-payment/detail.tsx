import type { ToolPageDetail } from '@/tools/page-detail';
import { CreditCardMinimumPaymentGuideArticle } from './CreditCardMinimumPaymentGuideArticle';
import {
  CREDIT_CARD_MINIMUM_PAYMENT_FAQS,
  CREDIT_CARD_MINIMUM_PAYMENT_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate how long minimum payments take to clear a credit card, including payoff date, total paid, and interest, with optional fixed add-on payments and real FX on money fields.',
  asideAriaLabel: 'Interactive Credit Card Minimum Payment Calculator',
  tocItems: CREDIT_CARD_MINIMUM_PAYMENT_TOC_ITEMS,
  GuideArticle: CreditCardMinimumPaymentGuideArticle,
  faqs: CREDIT_CARD_MINIMUM_PAYMENT_FAQS,
  countryRules: null,
};
