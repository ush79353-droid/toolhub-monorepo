import type { ToolPageDetail } from '@/tools/page-detail';
import { FeetToMilesGuideArticle } from './FeetToMilesGuideArticle';
import { FEET_TO_MILES_FAQS, FEET_TO_MILES_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert feet to miles and miles to feet instantly — 1 international mile = 5,280 feet exactly.',
  asideAriaLabel: 'Interactive feet to miles converter',
  tocItems: FEET_TO_MILES_TOC_ITEMS,
  GuideArticle: FeetToMilesGuideArticle,
  faqs: FEET_TO_MILES_FAQS,
  countryRules: null,
};
