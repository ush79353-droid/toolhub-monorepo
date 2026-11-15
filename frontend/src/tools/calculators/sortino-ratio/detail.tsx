import type { ToolPageDetail } from '@/tools/page-detail';
import { SortinoRatioGuideArticle } from './SortinoRatioGuideArticle';
import { SORTINO_RATIO_FAQS, SORTINO_RATIO_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead: 'Measure excess return per unit of downside deviation for one or two assets.',
  asideAriaLabel: 'Interactive Sortino Ratio Calculator',
  tocItems: SORTINO_RATIO_TOC_ITEMS,
  GuideArticle: SortinoRatioGuideArticle,
  faqs: SORTINO_RATIO_FAQS,
  countryRules: null,
};
