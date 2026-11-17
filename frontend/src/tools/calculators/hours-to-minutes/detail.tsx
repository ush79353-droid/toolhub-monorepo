import type { ToolPageDetail } from '@/tools/page-detail';
import { HoursToMinutesGuideArticle } from './HoursToMinutesGuideArticle';
import { HOURS_TO_MINUTES_FAQS, HOURS_TO_MINUTES_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert hours to minutes instantly. Calculate hours, minutes, seconds, and compound time with accurate results.',
  asideAriaLabel: 'Interactive hours to minutes converter',
  tocItems: HOURS_TO_MINUTES_TOC_ITEMS,
  GuideArticle: HoursToMinutesGuideArticle,
  faqs: HOURS_TO_MINUTES_FAQS,
  countryRules: null,
};
