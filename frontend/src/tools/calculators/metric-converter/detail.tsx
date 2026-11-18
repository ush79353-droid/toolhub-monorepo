import type { ToolPageDetail } from '@/tools/page-detail';
import { MetricConverterGuideArticle } from './MetricConverterGuideArticle';
import { METRIC_CONVERTER_FAQS, METRIC_CONVERTER_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert metric and imperial units instantly across length, mass, area, volume, temperature, speed, time, energy, power, pressure, and data storage.',
  asideAriaLabel: 'Interactive metric converter',
  tocItems: METRIC_CONVERTER_TOC_ITEMS,
  GuideArticle: MetricConverterGuideArticle,
  faqs: METRIC_CONVERTER_FAQS,
  countryRules: null,
};
