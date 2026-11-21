import type { ToolPageDetail } from '@/tools/page-detail';
import { KelvinConverterGuideArticle } from './KelvinConverterGuideArticle';
import { KELVIN_FAQS, KELVIN_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert kelvin to Celsius, Fahrenheit, Rankine, and other temperature scales; absolute zero is 0 K.',
  asideAriaLabel: 'Interactive Kelvin converter',
  tocItems: KELVIN_TOC_ITEMS,
  GuideArticle: KelvinConverterGuideArticle,
  faqs: KELVIN_FAQS,
  countryRules: null,
};
