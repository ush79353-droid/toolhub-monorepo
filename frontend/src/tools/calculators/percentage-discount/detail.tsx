import type { ToolPageDetail } from '@/tools/page-detail';
import { PercentageDiscountGuideArticle } from './PercentageDiscountGuideArticle';
import {
  PERCENTAGE_DISCOUNT_FAQS,
  PERCENTAGE_DISCOUNT_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Find the sale price and how much you save from an original price and a percentage discount, with independent FX on each money field.',
  asideAriaLabel: 'Interactive Percentage Discount Calculator',
  tocItems: PERCENTAGE_DISCOUNT_TOC_ITEMS,
  GuideArticle: PercentageDiscountGuideArticle,
  faqs: PERCENTAGE_DISCOUNT_FAQS,
  countryRules: null,
};
