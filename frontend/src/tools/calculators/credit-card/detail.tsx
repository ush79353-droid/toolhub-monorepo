import type { ToolPageDetail } from '@/tools/page-detail';
import { CreditCardGuideArticle } from './CreditCardGuideArticle';
import { CREDIT_CARD_FAQS, CREDIT_CARD_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate how long it takes to pay off a credit card balance with fixed or minimum payments, optional additional payments, and real FX on money fields.',
  asideAriaLabel: 'Interactive Credit Card Calculator',
  tocItems: CREDIT_CARD_TOC_ITEMS,
  GuideArticle: CreditCardGuideArticle,
  faqs: CREDIT_CARD_FAQS,
  countryRules: null,
};
