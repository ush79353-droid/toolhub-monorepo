import type { ToolPageDetail } from '@/tools/page-detail';
import { DiscountGuideArticle } from './DiscountGuideArticle';
import { DISCOUNT_FAQS, DISCOUNT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Find what you pay and how much you save after a percent-off discount on any original price, with independent FX on each money field. Tax included is a price label only — no tax rate is applied.',
  asideAriaLabel: 'Interactive Discount Calculator',
  tocItems: DISCOUNT_TOC_ITEMS,
  GuideArticle: DiscountGuideArticle,
  faqs: DISCOUNT_FAQS,
  countryRules: null,
};
