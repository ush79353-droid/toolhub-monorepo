import type { ToolPageDetail } from '@/tools/page-detail';
import { InToCmGuideArticle } from './InToCmGuideArticle';
import { IN_TO_CM_FAQS, IN_TO_CM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert inches to centimeters and centimeters to inches instantly; 1 inch equals exactly 2.54 centimeters.',
  asideAriaLabel: 'Interactive inches to centimeters converter',
  tocItems: IN_TO_CM_TOC_ITEMS,
  GuideArticle: InToCmGuideArticle,
  faqs: IN_TO_CM_FAQS,
  countryRules: null,
};
