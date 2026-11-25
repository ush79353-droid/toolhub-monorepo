import type { ToolPageDetail } from '@/tools/page-detail';

import { PeakFlowGuideArticle } from './PeakFlowGuideArticle';
import { PEAK_FLOW_FAQS, PEAK_FLOW_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational predicted PEF (Hankinson NHANES III / Nunn & Gregg) with % estimated, % personal best, and diurnal variability — not a clinical order.',
  asideAriaLabel: 'Interactive Peak Flow Calculator',
  tocItems: PEAK_FLOW_TOC_ITEMS,
  GuideArticle: PeakFlowGuideArticle,
  faqs: PEAK_FLOW_FAQS,
  countryRules: null,
};
