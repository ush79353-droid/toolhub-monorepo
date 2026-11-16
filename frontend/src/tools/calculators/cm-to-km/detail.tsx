import type { ToolPageDetail } from '@/tools/page-detail';
import { CmToKmGuideArticle } from './CmToKmGuideArticle';
import { CM_TO_KM_FAQS, CM_TO_KM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert centimeters to kilometers and kilometers to centimeters instantly using the exact factor 1 km = 100,000 cm.',
  asideAriaLabel: 'Interactive CM to KM conversion calculator',
  tocItems: CM_TO_KM_TOC_ITEMS,
  GuideArticle: CmToKmGuideArticle,
  faqs: CM_TO_KM_FAQS,
  countryRules: null,
};
