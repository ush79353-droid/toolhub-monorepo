import type { ToolPageDetail } from '@/tools/page-detail';
import { TimeZonesGuideArticle } from './TimeZonesGuideArticle';
import { TIME_ZONES_FAQS, TIME_ZONES_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert a date and time across IANA time zones. UTC, DST, half-hour offsets, and next-day results included.',
  asideAriaLabel: 'Interactive time zones converter',
  tocItems: TIME_ZONES_TOC_ITEMS,
  GuideArticle: TimeZonesGuideArticle,
  faqs: TIME_ZONES_FAQS,
  countryRules: null,
};
