import type { ToolPageDetail } from '@/tools/page-detail';
import { UnixTimeGuideArticle } from './UnixTimeGuideArticle';
import { UNIX_FAQS, UNIX_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert Unix timestamps to UTC dates and local times, with seconds/milliseconds modes and IANA time zones.',
  asideAriaLabel: 'Interactive Unix time converter',
  tocItems: UNIX_TOC_ITEMS,
  GuideArticle: UnixTimeGuideArticle,
  faqs: UNIX_FAQS,
  countryRules: null,
};
