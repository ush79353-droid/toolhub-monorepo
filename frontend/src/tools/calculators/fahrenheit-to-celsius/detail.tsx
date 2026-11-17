import type { ToolPageDetail } from '@/tools/page-detail';
import { FahrenheitToCelsiusGuideArticle } from './FahrenheitToCelsiusGuideArticle';
import {
  FAHRENHEIT_TO_CELSIUS_FAQS,
  FAHRENHEIT_TO_CELSIUS_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert Fahrenheit to Celsius and Celsius to Fahrenheit instantly. Formula: °C = (°F − 32) × 5/9.',
  asideAriaLabel: 'Interactive Fahrenheit to Celsius converter',
  tocItems: FAHRENHEIT_TO_CELSIUS_TOC_ITEMS,
  GuideArticle: FahrenheitToCelsiusGuideArticle,
  faqs: FAHRENHEIT_TO_CELSIUS_FAQS,
  countryRules: null,
};
