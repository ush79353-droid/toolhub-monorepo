import type { ToolPageDetail } from '@/tools/page-detail';
import { LungNoduleGrowthRateGuideArticle } from './LungNoduleGrowthRateGuideArticle';
import { LUNG_NODULE_FAQS, LUNG_NODULE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational Brock / PanCan nodule malignancy probability from first-screening CT features — not measured growth or volume doubling time.',
  asideAriaLabel: 'Interactive Lung Nodule Growth Rate Calculator',
  tocItems: LUNG_NODULE_TOC_ITEMS,
  GuideArticle: LungNoduleGrowthRateGuideArticle,
  faqs: LUNG_NODULE_FAQS,
  countryRules: null,
};
