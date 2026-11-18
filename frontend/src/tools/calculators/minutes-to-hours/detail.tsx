import type { ToolPageDetail } from '@/tools/page-detail';
import { MinutesToHoursGuideArticle } from './MinutesToHoursGuideArticle';
import { MINUTES_HOURS_FAQS, MINUTES_HOURS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert minutes to hours, seconds, and HH:MM:SS. Decimal hours and durations over 24 hours included.',
  asideAriaLabel: 'Interactive minutes to hours converter',
  tocItems: MINUTES_HOURS_TOC_ITEMS,
  GuideArticle: MinutesToHoursGuideArticle,
  faqs: MINUTES_HOURS_FAQS,
  countryRules: null,
};
