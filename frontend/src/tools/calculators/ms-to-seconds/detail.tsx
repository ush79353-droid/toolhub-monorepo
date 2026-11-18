import type { ToolPageDetail } from '@/tools/page-detail';
import { MsToSecondsGuideArticle } from './MsToSecondsGuideArticle';
import { MS_TO_SECONDS_FAQS, MS_TO_SECONDS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert milliseconds to seconds instantly. Exact: 1 s = 1000 ms. Expand Other Units for more.',
  asideAriaLabel: 'Interactive ms to seconds converter',
  tocItems: MS_TO_SECONDS_TOC_ITEMS,
  GuideArticle: MsToSecondsGuideArticle,
  faqs: MS_TO_SECONDS_FAQS,
  countryRules: null,
};
