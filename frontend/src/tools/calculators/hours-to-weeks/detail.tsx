import type { ToolPageDetail } from '@/tools/page-detail';
import { HoursToWeeksGuideArticle } from './HoursToWeeksGuideArticle';
import { HOURS_TO_WEEKS_FAQS, HOURS_TO_WEEKS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert hours to weeks instantly (and weeks back to hours) with days, minutes, seconds, and average Gregorian months or years.',
  asideAriaLabel: 'Interactive hours to week conversion calculator',
  tocItems: HOURS_TO_WEEKS_TOC_ITEMS,
  GuideArticle: HoursToWeeksGuideArticle,
  faqs: HOURS_TO_WEEKS_FAQS,
  countryRules: null,
};
