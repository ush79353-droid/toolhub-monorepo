import type { ToolPageDetail } from '@/tools/page-detail';
import { WeightWatchersPointsGuideArticle } from './WeightWatchersPointsGuideArticle';
import { WW_POINTS_FAQS, WW_POINTS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate educational SmartPoints from calories, sugar, protein, and saturated fat on a nutrition label — not affiliated with WW International.',
  asideAriaLabel: 'Interactive Weight Watchers Points Calculator',
  tocItems: WW_POINTS_TOC_ITEMS,
  GuideArticle: WeightWatchersPointsGuideArticle,
  faqs: WW_POINTS_FAQS,
  countryRules: null,
};
