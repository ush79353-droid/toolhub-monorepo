import type { ToolPageDetail } from '@/tools/page-detail';
import { YardConversionGuideArticle } from './YardConversionGuideArticle';
import { YARD_FAQS, YARD_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert yards to feet, inches, miles, meters, centimeters, millimeters, and kilometers. Exact: 1 yd = 0.9144 m = 3 ft = 36 in.',
  asideAriaLabel: 'Interactive yard conversion calculator',
  tocItems: YARD_TOC_ITEMS,
  GuideArticle: YardConversionGuideArticle,
  faqs: YARD_FAQS,
  countryRules: null,
};
