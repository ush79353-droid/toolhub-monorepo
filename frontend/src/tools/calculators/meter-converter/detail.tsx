import type { ToolPageDetail } from '@/tools/page-detail';
import { MeterConverterGuideArticle } from './MeterConverterGuideArticle';
import { METER_CONVERTER_FAQS, METER_CONVERTER_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert meters to feet, inches, centimeters, millimeters, kilometers, miles, nautical miles, and more; instantly and bidirectionally.',
  asideAriaLabel: 'Interactive meter converter',
  tocItems: METER_CONVERTER_TOC_ITEMS,
  GuideArticle: MeterConverterGuideArticle,
  faqs: METER_CONVERTER_FAQS,
  countryRules: null,
};
