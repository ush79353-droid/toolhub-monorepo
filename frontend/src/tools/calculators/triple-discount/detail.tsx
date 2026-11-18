import type { ToolPageDetail } from '@/tools/page-detail';
import { TripleDiscountGuideArticle } from './TripleDiscountGuideArticle';
import { TRIPLE_DISCOUNT_FAQS, TRIPLE_DISCOUNT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Stack three sequential percent-off discounts to see the true final price, savings, and combined effective discount, with independent FX on each money field.',
  asideAriaLabel: 'Interactive Triple Discount Calculator',
  tocItems: TRIPLE_DISCOUNT_TOC_ITEMS,
  GuideArticle: TripleDiscountGuideArticle,
  faqs: TRIPLE_DISCOUNT_FAQS,
  countryRules: null,
};
