import type { ToolPageDetail } from '@/tools/page-detail';
import { DistanceConverterGuideArticle } from './DistanceConverterGuideArticle';
import { DISTANCE_FAQS, DISTANCE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert metric, imperial/US, and specialized distance units instantly — meters are the canonical base.',
  asideAriaLabel: 'Interactive distance converter',
  tocItems: DISTANCE_TOC_ITEMS,
  GuideArticle: DistanceConverterGuideArticle,
  faqs: DISTANCE_FAQS,
  countryRules: null,
};
