import type { ToolPageDetail } from '@/tools/page-detail';
import { FeetToYardsGuideArticle } from './FeetToYardsGuideArticle';
import { FEET_TO_YARDS_FAQS, FEET_TO_YARDS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert feet to yards and yards to feet instantly; 1 yard equals exactly 3 feet.',
  asideAriaLabel: 'Interactive feet to yards conversion calculator',
  tocItems: FEET_TO_YARDS_TOC_ITEMS,
  GuideArticle: FeetToYardsGuideArticle,
  faqs: FEET_TO_YARDS_FAQS,
  countryRules: null,
};
