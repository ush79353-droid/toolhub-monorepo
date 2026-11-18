import type { ToolPageDetail } from '@/tools/page-detail';
import { CmToFtInGuideArticle } from './CmToFtInGuideArticle';
import { CM_TO_FT_IN_FAQS, CM_TO_FT_IN_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert centimeters to mixed feet and inches — and back — with exact 2.54 cm and 30.48 cm factors.',
  asideAriaLabel: 'Interactive CM to feet and inches converter',
  tocItems: CM_TO_FT_IN_TOC_ITEMS,
  GuideArticle: CmToFtInGuideArticle,
  faqs: CM_TO_FT_IN_FAQS,
  countryRules: null,
};
