import type { ToolPageDetail } from '@/tools/page-detail';
import { TemperatureGuideArticle } from './TemperatureGuideArticle';
import { TEMP_FAQS, TEMP_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert Celsius, Fahrenheit, Kelvin, Rankine, and other temperature scales instantly. Absolute zero is enforced at 0 K.',
  asideAriaLabel: 'Interactive temperature conversion calculator',
  tocItems: TEMP_TOC_ITEMS,
  GuideArticle: TemperatureGuideArticle,
  faqs: TEMP_FAQS,
  countryRules: null,
};
