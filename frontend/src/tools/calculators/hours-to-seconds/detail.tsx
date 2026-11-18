import type { ToolPageDetail } from '@/tools/page-detail';
import { HoursToSecondsGuideArticle } from './HoursToSecondsGuideArticle';
import { HOURS_TO_SECONDS_FAQS, HOURS_TO_SECONDS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert hours to seconds instantly. Calculate seconds, minutes, and compound time with accurate real-time results.',
  asideAriaLabel: 'Interactive hours to seconds converter',
  tocItems: HOURS_TO_SECONDS_TOC_ITEMS,
  GuideArticle: HoursToSecondsGuideArticle,
  faqs: HOURS_TO_SECONDS_FAQS,
  countryRules: null,
};
