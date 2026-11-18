import type { ToolPageDetail } from '@/tools/page-detail';
import { CelsiusToFahrenheitGuideArticle } from './CelsiusToFahrenheitGuideArticle';
import {
  CELSIUS_TO_FAHRENHEIT_FAQS,
  CELSIUS_TO_FAHRENHEIT_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert Celsius to Fahrenheit and Fahrenheit to Celsius instantly. Formula: °F = (°C × 9/5) + 32.',
  asideAriaLabel: 'Interactive Celsius to Fahrenheit converter',
  tocItems: CELSIUS_TO_FAHRENHEIT_TOC_ITEMS,
  GuideArticle: CelsiusToFahrenheitGuideArticle,
  faqs: CELSIUS_TO_FAHRENHEIT_FAQS,
  countryRules: null,
};
