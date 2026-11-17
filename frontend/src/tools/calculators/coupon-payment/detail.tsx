import type { ToolPageDetail } from '@/tools/page-detail';
import { CouponPaymentGuideArticle } from './CouponPaymentGuideArticle';
import { COUPON_PAYMENT_FAQS, COUPON_PAYMENT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compute each bond coupon payment from face value, annual rate, and payment frequency, with optional current yield and independent FX on money fields.',
  asideAriaLabel: 'Interactive Coupon Payment Calculator',
  tocItems: COUPON_PAYMENT_TOC_ITEMS,
  GuideArticle: CouponPaymentGuideArticle,
  faqs: COUPON_PAYMENT_FAQS,
  countryRules: null,
};
