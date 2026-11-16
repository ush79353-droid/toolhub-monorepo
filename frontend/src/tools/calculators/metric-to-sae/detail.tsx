import type { ToolPageDetail } from '@/tools/page-detail';
import { MetricToSaeGuideArticle } from './MetricToSaeGuideArticle';
import { METRIC_TO_SAE_FAQS, METRIC_TO_SAE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert metric lengths to SAE/US customary units (mm, cm, m, km ↔ in, ft, yd, mi) with exact international factors.',
  asideAriaLabel: 'Interactive Metric to SAE calculator',
  tocItems: METRIC_TO_SAE_TOC_ITEMS,
  GuideArticle: MetricToSaeGuideArticle,
  faqs: METRIC_TO_SAE_FAQS,
  countryRules: null,
};
