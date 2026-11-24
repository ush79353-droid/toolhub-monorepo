import type { ToolPageDetail } from '@/tools/page-detail';
import { VitaminDGuideArticle } from './VitaminDGuideArticle';
import { VITAMIN_D_FAQS, VITAMIN_D_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational vitamin D AI/RDA by age plus optional NIH ODS serum 25(OH)D bands—not a treatment dose from labs alone.',
  asideAriaLabel: 'Interactive Vitamin D Calculator',
  tocItems: VITAMIN_D_TOC_ITEMS,
  GuideArticle: VitaminDGuideArticle,
  faqs: VITAMIN_D_FAQS,
  countryRules: null,
};
