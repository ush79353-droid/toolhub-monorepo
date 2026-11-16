import type { ToolPageDetail } from '@/tools/page-detail';
import { CuFtToLbGuideArticle } from './CuFtToLbGuideArticle';
import { CU_FT_TO_LB_FAQS, CU_FT_TO_LB_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert cubic feet to pounds using material density. Default concrete ≈ 149.83 lb/ft³; switch materials or enter a custom density.',
  asideAriaLabel: 'Interactive cubic feet to pounds calculator',
  tocItems: CU_FT_TO_LB_TOC_ITEMS,
  GuideArticle: CuFtToLbGuideArticle,
  faqs: CU_FT_TO_LB_FAQS,
  countryRules: null,
};
