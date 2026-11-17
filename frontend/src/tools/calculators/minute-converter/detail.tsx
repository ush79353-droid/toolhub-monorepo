import type { ToolPageDetail } from '@/tools/page-detail';
import { MinuteConverterGuideArticle } from './MinuteConverterGuideArticle';
import { MINUTE_FAQS, MINUTE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert minutes to hours, seconds, days, weeks, months, and years. Exact: 1 hour = 60 minutes.',
  asideAriaLabel: 'Interactive minute converter',
  tocItems: MINUTE_TOC_ITEMS,
  GuideArticle: MinuteConverterGuideArticle,
  faqs: MINUTE_FAQS,
  countryRules: null,
};
