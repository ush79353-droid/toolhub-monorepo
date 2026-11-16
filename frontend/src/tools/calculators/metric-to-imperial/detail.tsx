import type { ToolPageDetail } from '@/tools/page-detail';
import { MetricToImperialGuideArticle } from './MetricToImperialGuideArticle';
import { METRIC_TO_IMPERIAL_FAQS, METRIC_TO_IMPERIAL_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert metric to imperial units instantly — meters to feet, kilograms to pounds, liters to gallons, Celsius to Fahrenheit, and more.',
  asideAriaLabel: 'Interactive metric to imperial converter',
  tocItems: METRIC_TO_IMPERIAL_TOC_ITEMS,
  GuideArticle: MetricToImperialGuideArticle,
  faqs: METRIC_TO_IMPERIAL_FAQS,
  countryRules: null,
};
