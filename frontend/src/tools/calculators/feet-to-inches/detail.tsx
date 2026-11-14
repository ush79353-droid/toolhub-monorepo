import type { ToolPageDetail } from '@/tools/page-detail';
import { FEET_TO_INCHES_FAQS, FEET_TO_INCHES_TOC_ITEMS } from './content';
import { FeetToInchesGuideArticle } from './FeetToInchesGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert feet to inches and inches to feet instantly, with matching lengths in millimeters, centimeters, meters, yards, kilometers, and miles.',
  asideAriaLabel: 'Interactive feet to inches calculator',
  tocItems: FEET_TO_INCHES_TOC_ITEMS,
  GuideArticle: FeetToInchesGuideArticle,
  faqs: FEET_TO_INCHES_FAQS,
  countryRules: null,
};
