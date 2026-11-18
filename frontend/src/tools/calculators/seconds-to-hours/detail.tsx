import type { ToolPageDetail } from '@/tools/page-detail';
import { SecondsToHoursGuideArticle } from './SecondsToHoursGuideArticle';
import { S2H_FAQS, S2H_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert seconds to hours and hours to seconds. Exact: 1 hour = 3,600 seconds. Includes hours/minutes/seconds breakdown.',
  asideAriaLabel: 'Interactive seconds to hours converter',
  tocItems: S2H_TOC_ITEMS,
  GuideArticle: SecondsToHoursGuideArticle,
  faqs: S2H_FAQS,
  countryRules: null,
};
