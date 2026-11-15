import type { ToolPageDetail } from '@/tools/page-detail';
import { SellThroughRateGuideArticle } from './SellThroughRateGuideArticle';
import { SELL_THROUGH_RATE_FAQS, SELL_THROUGH_RATE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead: 'Calculate sell-through rate from units sold and units received.',
  asideAriaLabel: 'Interactive Sell-Through Rate Calculator',
  tocItems: SELL_THROUGH_RATE_TOC_ITEMS,
  GuideArticle: SellThroughRateGuideArticle,
  faqs: SELL_THROUGH_RATE_FAQS,
  countryRules: null,
};
