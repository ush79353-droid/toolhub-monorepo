import type { ToolPageDetail } from '@/tools/page-detail';
import { MmToInchesGuideArticle } from './MmToInchesGuideArticle';
import { MM_TO_INCHES_FAQS, MM_TO_INCHES_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert millimeters to inches and inches to millimeters; 1 in = 25.4 mm exactly.',
  asideAriaLabel: 'Interactive millimeters to inches converter',
  tocItems: MM_TO_INCHES_TOC_ITEMS,
  GuideArticle: MmToInchesGuideArticle,
  faqs: MM_TO_INCHES_FAQS,
  countryRules: null,
};
