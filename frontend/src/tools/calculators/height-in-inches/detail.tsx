import type { ToolPageDetail } from '@/tools/page-detail';
import { HeightInInchesGuideArticle } from './HeightInInchesGuideArticle';
import { HEIGHT_IN_INCHES_FAQS, HEIGHT_IN_INCHES_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert height between feet and inches, total inches, centimeters, and meters with exact international factors.',
  asideAriaLabel: 'Interactive height in inches calculator',
  tocItems: HEIGHT_IN_INCHES_TOC_ITEMS,
  GuideArticle: HeightInInchesGuideArticle,
  faqs: HEIGHT_IN_INCHES_FAQS,
  countryRules: null,
};
