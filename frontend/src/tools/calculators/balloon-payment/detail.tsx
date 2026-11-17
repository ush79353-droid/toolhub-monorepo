import type { ToolPageDetail } from '@/tools/page-detail';
import { BalloonPaymentGuideArticle } from './BalloonPaymentGuideArticle';
import { BALLOON_PAYMENT_FAQS, BALLOON_PAYMENT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate fixed monthly payments and the remaining balloon balance for a partially amortized loan, with real FX on the loan amount.',
  asideAriaLabel: 'Interactive Balloon Payment Calculator',
  tocItems: BALLOON_PAYMENT_TOC_ITEMS,
  GuideArticle: BalloonPaymentGuideArticle,
  faqs: BALLOON_PAYMENT_FAQS,
  countryRules: null,
};
