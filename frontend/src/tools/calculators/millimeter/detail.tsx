import type { ToolPageDetail } from '@/tools/page-detail';
import { MillimeterGuideArticle } from './MillimeterGuideArticle';
import { MM_FAQS, MM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert millimeters to inches, centimeters, meters, feet, miles, and more. Exact: 1 inch = 25.4 mm.',
  asideAriaLabel: 'Interactive millimeter calculator',
  tocItems: MM_TOC_ITEMS,
  GuideArticle: MillimeterGuideArticle,
  faqs: MM_FAQS,
  countryRules: null,
};
