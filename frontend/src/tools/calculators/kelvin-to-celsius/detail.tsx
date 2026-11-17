import type { ToolPageDetail } from '@/tools/page-detail';
import { KelvinToCelsiusGuideArticle } from './KelvinToCelsiusGuideArticle';
import { KELVIN_TO_CELSIUS_FAQS, KELVIN_TO_CELSIUS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert Kelvin to Celsius and Celsius to Kelvin instantly. Formula: °C = K − 273.15.',
  asideAriaLabel: 'Interactive Kelvin to Celsius converter',
  tocItems: KELVIN_TO_CELSIUS_TOC_ITEMS,
  GuideArticle: KelvinToCelsiusGuideArticle,
  faqs: KELVIN_TO_CELSIUS_FAQS,
  countryRules: null,
};
