import type { ToolPageDetail } from '@/tools/page-detail';
import { CentimeterGuideArticle } from './CentimeterGuideArticle';
import { CENTIMETER_FAQS, CENTIMETER_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert centimeters to inches, feet, meters, millimeters, and more with exact international length factors.',
  asideAriaLabel: 'Interactive centimeter calculator',
  tocItems: CENTIMETER_TOC_ITEMS,
  GuideArticle: CentimeterGuideArticle,
  faqs: CENTIMETER_FAQS,
  countryRules: null,
};
