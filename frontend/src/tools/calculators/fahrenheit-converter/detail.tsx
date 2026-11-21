import type { ToolPageDetail } from '@/tools/page-detail';
import { FahrenheitConverterGuideArticle } from './FahrenheitConverterGuideArticle';
import { FAHRENHEIT_FAQS, FAHRENHEIT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert Fahrenheit (°F) to Celsius, Kelvin, Rankine, Delisle, Newton, Réaumur, and Rømer; absolute zero is −459.67°F.',
  asideAriaLabel: 'Interactive Fahrenheit converter',
  tocItems: FAHRENHEIT_TOC_ITEMS,
  GuideArticle: FahrenheitConverterGuideArticle,
  faqs: FAHRENHEIT_FAQS,
  countryRules: null,
};
