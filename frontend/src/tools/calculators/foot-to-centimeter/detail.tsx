import type { ToolPageDetail } from '@/tools/page-detail';
import { FootToCmGuideArticle } from './FootToCmGuideArticle';
import { FOOT_TO_CM_FAQS, FOOT_TO_CM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert feet to centimeters and centimeters to feet instantly; 1 ft equals exactly 30.48 cm.',
  asideAriaLabel: 'Interactive foot to centimeter converter',
  tocItems: FOOT_TO_CM_TOC_ITEMS,
  GuideArticle: FootToCmGuideArticle,
  faqs: FOOT_TO_CM_FAQS,
  countryRules: null,
};
