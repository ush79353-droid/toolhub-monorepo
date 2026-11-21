import type { ToolPageDetail } from '@/tools/page-detail';
import { CuInToGalGuideArticle } from './CuInToGalGuideArticle';
import { CU_IN_TO_GAL_FAQS, CU_IN_TO_GAL_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert cubic inches to US or UK gallons (and liters) using exact definitions (231 in³ per US gal; 4.54609 L per UK gal).',
  asideAriaLabel: 'Interactive cubic inches to gallons converter',
  tocItems: CU_IN_TO_GAL_TOC_ITEMS,
  GuideArticle: CuInToGalGuideArticle,
  faqs: CU_IN_TO_GAL_FAQS,
  countryRules: null,
};
