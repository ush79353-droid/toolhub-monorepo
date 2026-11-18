import type { ToolPageDetail } from '@/tools/page-detail';
import { AcresToSquareFeetGuideArticle } from './AcresToSquareFeetGuideArticle';
import { ACRES_TO_SQUARE_FEET_FAQS, ACRES_TO_SQUARE_FEET_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert acres to square feet and square feet to acres instantly using the exact factor 1 acre = 43,560 ft².',
  asideAriaLabel: 'Interactive acres to square feet converter',
  tocItems: ACRES_TO_SQUARE_FEET_TOC_ITEMS,
  GuideArticle: AcresToSquareFeetGuideArticle,
  faqs: ACRES_TO_SQUARE_FEET_FAQS,
  countryRules: null,
};
