import type { ToolPageDetail } from '@/tools/page-detail';
import { CmToInGuideArticle } from './CmToInGuideArticle';
import { CM_TO_IN_FAQS, CM_TO_IN_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert centimeters to inches and inches to centimeters instantly using the exact factor 1 in = 2.54 cm.',
  asideAriaLabel: 'Interactive CM to inches converter',
  tocItems: CM_TO_IN_TOC_ITEMS,
  GuideArticle: CmToInGuideArticle,
  faqs: CM_TO_IN_FAQS,
  countryRules: null,
};
