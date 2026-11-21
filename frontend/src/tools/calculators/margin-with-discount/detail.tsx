import type { ToolPageDetail } from '@/tools/page-detail';
import { MarginWithDiscountGuideArticle } from './MarginWithDiscountGuideArticle';
import {
  MARGIN_WITH_DISCOUNT_FAQS,
  MARGIN_WITH_DISCOUNT_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'See how a discount changes margin, markup, and profit from cost and a target margin or markup, with independent FX on each money field.',
  asideAriaLabel: 'Interactive Margin With Discount Calculator',
  tocItems: MARGIN_WITH_DISCOUNT_TOC_ITEMS,
  GuideArticle: MarginWithDiscountGuideArticle,
  faqs: MARGIN_WITH_DISCOUNT_FAQS,
  countryRules: null,
};
