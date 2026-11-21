import type { ToolPageDetail } from '@/tools/page-detail';
import { CouponRateGuideArticle } from './CouponRateGuideArticle';
import { COUPON_RATE_FAQS, COUPON_RATE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Use this Coupon Rate Calculator to calculate the annual coupon rate of a bond based on its face value and periodic interest payments. You can also determine the annual coupon payment and the amount received each payment period.',
  asideAriaLabel: 'Interactive Coupon Rate Calculator',
  tocItems: COUPON_RATE_TOC_ITEMS,
  GuideArticle: CouponRateGuideArticle,
  faqs: COUPON_RATE_FAQS,
  countryRules: null,
};
