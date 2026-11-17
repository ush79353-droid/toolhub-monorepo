import type { ToolPageDetail } from '@/tools/page-detail';
import { MillisecondsGuideArticle } from './MillisecondsGuideArticle';
import { MS_FAQS, MS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert milliseconds to seconds, minutes, hours, days, and more. Exact: 1 second = 1000 ms.',
  asideAriaLabel: 'Interactive milliseconds converter',
  tocItems: MS_TOC_ITEMS,
  GuideArticle: MillisecondsGuideArticle,
  faqs: MS_FAQS,
  countryRules: null,
};
