import type { ToolPageDetail } from '@/tools/page-detail';
import { MmToMGuideArticle } from './MmToMGuideArticle';
import { MM_TO_M_FAQS, MM_TO_M_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert millimeters to meters and meters to millimeters — 1 m = 1000 mm exactly.',
  asideAriaLabel: 'Interactive millimeters to meters converter',
  tocItems: MM_TO_M_TOC_ITEMS,
  GuideArticle: MmToMGuideArticle,
  faqs: MM_TO_M_FAQS,
  countryRules: null,
};
