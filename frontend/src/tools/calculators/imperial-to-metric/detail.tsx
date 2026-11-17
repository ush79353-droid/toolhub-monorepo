import type { ToolPageDetail } from '@/tools/page-detail';
import { ImperialToMetricGuideArticle } from './ImperialToMetricGuideArticle';
import { IMPERIAL_TO_METRIC_FAQS, IMPERIAL_TO_METRIC_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert Imperial and US customary units to metric — length, area, volume, mass, and temperature — with exact shared conversion factors.',
  asideAriaLabel: 'Interactive imperial to metric conversion calculator',
  tocItems: IMPERIAL_TO_METRIC_TOC_ITEMS,
  GuideArticle: ImperialToMetricGuideArticle,
  faqs: IMPERIAL_TO_METRIC_FAQS,
  countryRules: null,
};
