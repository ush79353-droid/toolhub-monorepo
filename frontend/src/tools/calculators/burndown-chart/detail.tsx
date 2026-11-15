import type { ToolPageDetail } from '@/tools/page-detail';
import { BurndownChartGuideArticle } from './BurndownChartGuideArticle';
import { BURNDOWN_CHART_FAQS, BURNDOWN_CHART_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Track ideal vs actual remaining story points across a sprint with a simple burndown chart.',
  asideAriaLabel: 'Interactive Burndown Chart Calculator',
  tocItems: BURNDOWN_CHART_TOC_ITEMS,
  GuideArticle: BurndownChartGuideArticle,
  faqs: BURNDOWN_CHART_FAQS,
  countryRules: null,
};
