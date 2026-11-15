import type { ToolPageDetail } from '@/tools/page-detail';
import { InformationRatioGuideArticle } from './InformationRatioGuideArticle';
import { INFORMATION_RATIO_FAQS, INFORMATION_RATIO_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead: 'Measure active return per unit of tracking error versus a benchmark.',
  asideAriaLabel: 'Interactive Information Ratio Calculator',
  tocItems: INFORMATION_RATIO_TOC_ITEMS,
  GuideArticle: InformationRatioGuideArticle,
  faqs: INFORMATION_RATIO_FAQS,
  countryRules: null,
};
