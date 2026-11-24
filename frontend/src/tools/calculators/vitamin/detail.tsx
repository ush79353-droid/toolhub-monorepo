import type { ToolPageDetail } from '@/tools/page-detail';
import { VitaminGuideArticle } from './VitaminGuideArticle';
import { VITAMIN_FAQS, VITAMIN_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Look up age- and sex-specific Dietary Reference Intakes for vitamins — RDA or AI with Tolerable Upper Intake Level when published.',
  asideAriaLabel: 'Interactive Vitamin Calculator',
  tocItems: VITAMIN_TOC_ITEMS,
  GuideArticle: VitaminGuideArticle,
  faqs: VITAMIN_FAQS,
  countryRules: null,
};
