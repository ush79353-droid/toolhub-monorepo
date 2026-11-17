import type { ToolPageDetail } from '@/tools/page-detail';
import { MinutesToSecondsGuideArticle } from './MinutesToSecondsGuideArticle';
import { M2S_FAQS, M2S_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert minutes to seconds and back. Exact: 1 minute = 60 seconds. Includes combined minutes-and-seconds view.',
  asideAriaLabel: 'Interactive minutes to seconds converter',
  tocItems: M2S_TOC_ITEMS,
  GuideArticle: MinutesToSecondsGuideArticle,
  faqs: M2S_FAQS,
  countryRules: null,
};
