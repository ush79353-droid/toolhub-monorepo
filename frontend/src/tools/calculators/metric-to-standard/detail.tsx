import type { ToolPageDetail } from '@/tools/page-detail';
import { MetricToStandardGuideArticle } from './MetricToStandardGuideArticle';
import { METRIC_TO_STANDARD_FAQS, METRIC_TO_STANDARD_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert metric to standard units instantly — meters to feet, kilograms to pounds, liters to gallons, Celsius to Fahrenheit, and more.',
  asideAriaLabel: 'Interactive metric to standard converter',
  tocItems: METRIC_TO_STANDARD_TOC_ITEMS,
  GuideArticle: MetricToStandardGuideArticle,
  faqs: METRIC_TO_STANDARD_FAQS,
  countryRules: null,
};
