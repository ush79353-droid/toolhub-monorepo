import type { ToolPageDetail } from '@/tools/page-detail';
import { WeightWatcherPointsGuideArticle } from './WeightWatcherPointsGuideArticle';
import {
  WEIGHT_WATCHER_POINTS_FAQS,
  WEIGHT_WATCHER_POINTS_TOC,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational SmartPoints food estimate from calories, sugar, protein, and saturated fat — not affiliated with WW.',
  asideAriaLabel: 'Interactive Weight Watcher Points Calculator',
  tocItems: WEIGHT_WATCHER_POINTS_TOC,
  GuideArticle: WeightWatcherPointsGuideArticle,
  faqs: WEIGHT_WATCHER_POINTS_FAQS,
  countryRules: null,
};
