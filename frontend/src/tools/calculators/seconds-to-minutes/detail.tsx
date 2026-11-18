import type { ToolPageDetail } from '@/tools/page-detail';
import { SecondsToMinutesGuideArticle } from './SecondsToMinutesGuideArticle';
import { S2M_FAQS, S2M_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert seconds to minutes and minutes to seconds. Exact: 1 minute = 60 seconds.',
  asideAriaLabel: 'Interactive seconds to minutes converter',
  tocItems: S2M_TOC_ITEMS,
  GuideArticle: SecondsToMinutesGuideArticle,
  faqs: S2M_FAQS,
  countryRules: null,
};
