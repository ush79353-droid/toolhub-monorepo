import type { ToolPageDetail } from '@/tools/page-detail';
import { DiscountRateGuideArticle } from './DiscountRateGuideArticle';
import { DISCOUNT_RATE_FAQS, DISCOUNT_RATE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead: 'Find the annual discount rate from present value, future value, and cash flows.',
  asideAriaLabel: 'Interactive Discount Rate Calculator',
  tocItems: DISCOUNT_RATE_TOC_ITEMS,
  GuideArticle: DiscountRateGuideArticle,
  faqs: DISCOUNT_RATE_FAQS,
  countryRules: null,
};
