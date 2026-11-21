import type { ToolPageDetail } from '@/tools/page-detail';
import { CreditCardPayoffGuideArticle } from './CreditCardPayoffGuideArticle';
import {
  CREDIT_CARD_PAYOFF_FAQS,
  CREDIT_CARD_PAYOFF_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate how long a fixed monthly payment takes to clear a credit card balance, with years, months, days, total paid, and real FX on money fields.',
  asideAriaLabel: 'Interactive Credit Card Payoff Calculator',
  tocItems: CREDIT_CARD_PAYOFF_TOC_ITEMS,
  GuideArticle: CreditCardPayoffGuideArticle,
  faqs: CREDIT_CARD_PAYOFF_FAQS,
  countryRules: null,
};
