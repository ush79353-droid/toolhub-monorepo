import type { ToolPageDetail } from '@/tools/page-detail';
import { CmToMGuideArticle } from './CmToMGuideArticle';
import { CM_TO_M_FAQS, CM_TO_M_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert centimeters to meters and meters to centimeters instantly using the exact factor 1 m = 100 cm.',
  asideAriaLabel: 'Interactive CM to M converter',
  tocItems: CM_TO_M_TOC_ITEMS,
  GuideArticle: CmToMGuideArticle,
  faqs: CM_TO_M_FAQS,
  countryRules: null,
};
