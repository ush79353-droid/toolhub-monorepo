import type { ToolPageDetail } from '@/tools/page-detail';
import { KilometerCalculatorGuideArticle } from './KilometerCalculatorGuideArticle';
import { KM_FAQS, KM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert kilometers to miles, meters, feet, inches, yards, centimeters, and millimeters; 1 km = 1,000 m exactly.',
  asideAriaLabel: 'Interactive kilometer calculator',
  tocItems: KM_TOC_ITEMS,
  GuideArticle: KilometerCalculatorGuideArticle,
  faqs: KM_FAQS,
  countryRules: null,
};
