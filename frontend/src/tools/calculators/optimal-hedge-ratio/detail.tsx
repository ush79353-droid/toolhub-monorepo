import type { ToolPageDetail } from '@/tools/page-detail';
import { OptimalHedgeRatioGuideArticle } from './OptimalHedgeRatioGuideArticle';
import {
  OPTIMAL_HEDGE_RATIO_FAQS,
  OPTIMAL_HEDGE_RATIO_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Find the minimum-variance hedge ratio from spot and futures volatilities and their correlation.',
  asideAriaLabel: 'Interactive Optimal Hedge Ratio Calculator',
  tocItems: OPTIMAL_HEDGE_RATIO_TOC_ITEMS,
  GuideArticle: OptimalHedgeRatioGuideArticle,
  faqs: OPTIMAL_HEDGE_RATIO_FAQS,
  countryRules: null,
};
