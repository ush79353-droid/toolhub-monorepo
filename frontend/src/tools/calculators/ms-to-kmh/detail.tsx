import type { ToolPageDetail } from '@/tools/page-detail';
import { MsToKmhGuideArticle } from './MsToKmhGuideArticle';
import { MS_TO_KMH_FAQS, MS_TO_KMH_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert meters per second to kilometers per hour, mph, feet per second, knots, and more — instantly and bidirectionally.',
  asideAriaLabel: 'Interactive m/s to km/h converter',
  tocItems: MS_TO_KMH_TOC_ITEMS,
  GuideArticle: MsToKmhGuideArticle,
  faqs: MS_TO_KMH_FAQS,
  countryRules: null,
};
