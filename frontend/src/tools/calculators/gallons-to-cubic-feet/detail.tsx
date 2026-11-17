import type { ToolPageDetail } from '@/tools/page-detail';
import { GalToCuFtGuideArticle } from './GalToCuFtGuideArticle';
import { GAL_TO_CU_FT_FAQS, GAL_TO_CU_FT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert US liquid gallons, UK imperial gallons, and cubic feet instantly — exact liter-based factors.',
  asideAriaLabel: 'Interactive gallons to cubic feet converter',
  tocItems: GAL_TO_CU_FT_TOC_ITEMS,
  GuideArticle: GalToCuFtGuideArticle,
  faqs: GAL_TO_CU_FT_FAQS,
  countryRules: null,
};
