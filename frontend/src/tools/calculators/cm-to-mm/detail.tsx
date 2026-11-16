import type { ToolPageDetail } from '@/tools/page-detail';
import { CmToMmGuideArticle } from './CmToMmGuideArticle';
import { CM_TO_MM_FAQS, CM_TO_MM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert centimeters to millimeters and millimeters to centimeters instantly using the exact factor 1 cm = 10 mm.',
  asideAriaLabel: 'Interactive CM to MM converter',
  tocItems: CM_TO_MM_TOC_ITEMS,
  GuideArticle: CmToMmGuideArticle,
  faqs: CM_TO_MM_FAQS,
  countryRules: null,
};
