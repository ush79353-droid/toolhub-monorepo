import type { ToolPageDetail } from '@/tools/page-detail';
import { CuFtToGalGuideArticle } from './CuFtToGalGuideArticle';
import { CU_FT_TO_GAL_FAQS, CU_FT_TO_GAL_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert cubic feet to US or UK gallons (and back) using exact cubic-meter definitions for both gallon systems.',
  asideAriaLabel: 'Interactive cubic feet to gallons converter',
  tocItems: CU_FT_TO_GAL_TOC_ITEMS,
  GuideArticle: CuFtToGalGuideArticle,
  faqs: CU_FT_TO_GAL_FAQS,
  countryRules: null,
};
