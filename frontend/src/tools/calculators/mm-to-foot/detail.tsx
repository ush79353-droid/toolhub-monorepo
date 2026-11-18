import type { ToolPageDetail } from '@/tools/page-detail';
import { MmToFootGuideArticle } from './MmToFootGuideArticle';
import { MM_TO_FOOT_FAQS, MM_TO_FOOT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert millimeters to feet and feet to millimeters — 1 ft = 304.8 mm exactly.',
  asideAriaLabel: 'Interactive millimeters to feet converter',
  tocItems: MM_TO_FOOT_TOC_ITEMS,
  GuideArticle: MmToFootGuideArticle,
  faqs: MM_TO_FOOT_FAQS,
  countryRules: null,
};
