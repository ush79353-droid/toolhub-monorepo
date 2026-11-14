import type { ToolPageDetail } from '@/tools/page-detail';
import { HedgeRatioGuideArticle } from './HedgeRatioGuideArticle';
import { HEDGE_RATIO_FAQS, HEDGE_RATIO_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead: 'Measure how much of an exposure is covered by a hedge position.',
  asideAriaLabel: 'Interactive Hedge Ratio Calculator',
  tocItems: HEDGE_RATIO_TOC_ITEMS,
  GuideArticle: HedgeRatioGuideArticle,
  faqs: HEDGE_RATIO_FAQS,
  countryRules: null,
};
