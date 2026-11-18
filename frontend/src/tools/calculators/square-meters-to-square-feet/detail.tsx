import type { ToolPageDetail } from '@/tools/page-detail';
import { SquareMetersToSquareFeetGuideArticle } from './SquareMetersToSquareFeetGuideArticle';
import { M2_TO_FT2_FAQS, M2_TO_FT2_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert square meters to square feet and back with exact international-foot factors — plus optional other area units.',
  asideAriaLabel: 'Interactive square meters to square feet converter',
  tocItems: M2_TO_FT2_TOC_ITEMS,
  GuideArticle: SquareMetersToSquareFeetGuideArticle,
  faqs: M2_TO_FT2_FAQS,
  countryRules: null,
};
