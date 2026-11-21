import type { ToolPageDetail } from '@/tools/page-detail';
import { MmToKmGuideArticle } from './MmToKmGuideArticle';
import { MM_TO_KM_FAQS, MM_TO_KM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert millimeters to kilometers and kilometers to millimeters; 1 km = 1,000,000 mm exactly.',
  asideAriaLabel: 'Interactive millimeters to kilometers converter',
  tocItems: MM_TO_KM_TOC_ITEMS,
  GuideArticle: MmToKmGuideArticle,
  faqs: MM_TO_KM_FAQS,
  countryRules: null,
};
