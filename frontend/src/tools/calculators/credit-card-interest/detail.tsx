import type { ToolPageDetail } from '@/tools/page-detail';
import { CreditCardInterestGuideArticle } from './CreditCardInterestGuideArticle';
import {
  CREDIT_CARD_INTEREST_FAQS,
  CREDIT_CARD_INTEREST_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate payoff time, total paid, and interest on a credit card balance with fixed or minimum payments, optional extra payments, and real FX on money fields.',
  asideAriaLabel: 'Interactive Credit Card Interest Calculator',
  tocItems: CREDIT_CARD_INTEREST_TOC_ITEMS,
  GuideArticle: CreditCardInterestGuideArticle,
  faqs: CREDIT_CARD_INTEREST_FAQS,
  countryRules: null,
};
