import type { ToolPageDetail } from '@/tools/page-detail';
import { DoubleDiscountGuideArticle } from './DoubleDiscountGuideArticle';
import { DOUBLE_DISCOUNT_FAQS, DOUBLE_DISCOUNT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Stack two sequential percent-off discounts to see the true final price, total savings, and combined effective discount, with independent FX on each money field.',
  asideAriaLabel: 'Interactive Double Discount Calculator',
  tocItems: DOUBLE_DISCOUNT_TOC_ITEMS,
  GuideArticle: DoubleDiscountGuideArticle,
  faqs: DOUBLE_DISCOUNT_FAQS,
  countryRules: null,
};
