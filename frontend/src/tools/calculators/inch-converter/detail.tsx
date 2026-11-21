import type { ToolPageDetail } from '@/tools/page-detail';
import { InchConverterGuideArticle } from './InchConverterGuideArticle';
import { INCH_FAQS, INCH_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert inches to centimeters, millimeters, meters, feet, yards, miles, and more; 1 in = 0.0254 m exactly.',
  asideAriaLabel: 'Interactive inch converter',
  tocItems: INCH_TOC_ITEMS,
  GuideArticle: InchConverterGuideArticle,
  faqs: INCH_FAQS,
  countryRules: null,
};
