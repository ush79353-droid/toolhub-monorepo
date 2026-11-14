import type { ToolPageDetail } from '@/tools/page-detail';
import { DECIMETER_TO_METER_FAQS, DECIMETER_TO_METER_TOC_ITEMS } from './content';
import { DecimeterToMeterGuideArticle } from './DecimeterToMeterGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert decimeters to meters and meters to decimeters instantly. Exact factor of ten, with optional millimeters, centimeters, kilometers, inches, feet, and yards.',
  asideAriaLabel: 'Interactive decimeter to meter converter',
  tocItems: DECIMETER_TO_METER_TOC_ITEMS,
  GuideArticle: DecimeterToMeterGuideArticle,
  faqs: DECIMETER_TO_METER_FAQS,
  countryRules: null,
};
