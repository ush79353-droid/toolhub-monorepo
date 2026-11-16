import type { ToolPageDetail } from '@/tools/page-detail';
import { MeasurementConverterGuideArticle } from './MeasurementConverterGuideArticle';
import { MEASUREMENT_FAQS, MEASUREMENT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert length, mass, area, volume, speed, temperature, pressure, energy, and more with SI-based factors and dimensional checks.',
  asideAriaLabel: 'Interactive measurement converter',
  tocItems: MEASUREMENT_TOC_ITEMS,
  GuideArticle: MeasurementConverterGuideArticle,
  faqs: MEASUREMENT_FAQS,
  countryRules: null,
};
