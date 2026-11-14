import type { ToolPageDetail } from '@/tools/page-detail';
import { FEET_AND_INCHES_FAQS, FEET_AND_INCHES_TOC_ITEMS } from './content';
import { FeetAndInchesGuideArticle } from './FeetAndInchesGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Add, subtract, multiply, and divide feet-and-inches measurements with fractional-inch precision and metric equivalents.',
  asideAriaLabel: 'Interactive feet and inches calculator',
  tocItems: FEET_AND_INCHES_TOC_ITEMS,
  GuideArticle: FeetAndInchesGuideArticle,
  faqs: FEET_AND_INCHES_FAQS,
  countryRules: null,
};
