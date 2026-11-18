import type { ToolPageDetail } from '@/tools/page-detail';
import { CelsiusConverterGuideArticle } from './CelsiusConverterGuideArticle';
import { CELSIUS_CONVERTER_FAQS, CELSIUS_CONVERTER_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert Celsius to Fahrenheit, Kelvin, Rankine, Delisle, Newton, Réaumur, and Rømer instantly. Absolute zero is −273.15°C.',
  asideAriaLabel: 'Interactive Celsius converter',
  tocItems: CELSIUS_CONVERTER_TOC_ITEMS,
  GuideArticle: CelsiusConverterGuideArticle,
  faqs: CELSIUS_CONVERTER_FAQS,
  countryRules: null,
};
