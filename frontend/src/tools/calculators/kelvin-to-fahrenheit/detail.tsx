import type { ToolPageDetail } from '@/tools/page-detail';
import { KelvinToFahrenheitGuideArticle } from './KelvinToFahrenheitGuideArticle';
import {
  KELVIN_TO_FAHRENHEIT_FAQS,
  KELVIN_TO_FAHRENHEIT_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert Kelvin to Fahrenheit and Fahrenheit to Kelvin instantly. Formula: °F = (K − 273.15) × 9/5 + 32.',
  asideAriaLabel: 'Interactive Kelvin to Fahrenheit converter',
  tocItems: KELVIN_TO_FAHRENHEIT_TOC_ITEMS,
  GuideArticle: KelvinToFahrenheitGuideArticle,
  faqs: KELVIN_TO_FAHRENHEIT_FAQS,
  countryRules: null,
};
