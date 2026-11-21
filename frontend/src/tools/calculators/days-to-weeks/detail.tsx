import type { ToolPageDetail } from '@/tools/page-detail';
import { DaysToWeeksGuideArticle } from './DaysToWeeksGuideArticle';
import { DAYS_TO_WEEKS_FAQS, DAYS_TO_WEEKS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert days to weeks (and reverse) with exact 7-day weeks, plus average years/months and hours, minutes, and seconds.',
  asideAriaLabel: 'Interactive days to weeks calculator',
  tocItems: DAYS_TO_WEEKS_TOC_ITEMS,
  GuideArticle: DaysToWeeksGuideArticle,
  faqs: DAYS_TO_WEEKS_FAQS,
  countryRules: null,
};
