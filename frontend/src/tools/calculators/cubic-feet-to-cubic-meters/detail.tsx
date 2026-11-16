import type { ToolPageDetail } from '@/tools/page-detail';
import { CuFtToCuMGuideArticle } from './CuFtToCuMGuideArticle';
import { CU_FT_TO_CU_M_FAQS, CU_FT_TO_CU_M_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert cubic feet to cubic meters and cubic meters to cubic feet instantly using the exact factor 1 ft³ = 0.028316846592 m³.',
  asideAriaLabel: 'Interactive cubic feet to cubic meters converter',
  tocItems: CU_FT_TO_CU_M_TOC_ITEMS,
  GuideArticle: CuFtToCuMGuideArticle,
  faqs: CU_FT_TO_CU_M_FAQS,
  countryRules: null,
};
