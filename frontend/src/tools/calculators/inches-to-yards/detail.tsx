import type { ToolPageDetail } from '@/tools/page-detail';
import { InchesToYardsGuideArticle } from './InchesToYardsGuideArticle';
import { INCHES_TO_YARDS_FAQS, INCHES_TO_YARDS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert inches to yards and yards to inches instantly — 1 yard equals exactly 36 inches.',
  asideAriaLabel: 'Interactive inches to yard conversion calculator',
  tocItems: INCHES_TO_YARDS_TOC_ITEMS,
  GuideArticle: InchesToYardsGuideArticle,
  faqs: INCHES_TO_YARDS_FAQS,
  countryRules: null,
};
