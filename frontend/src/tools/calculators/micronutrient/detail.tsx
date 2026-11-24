import type { ToolPageDetail } from '@/tools/page-detail';
import { MicronutrientGuideArticle } from './MicronutrientGuideArticle';
import { MICRONUTRIENT_FAQS, MICRONUTRIENT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Look up age- and sex-specific Dietary Reference Intakes for mineral elements — RDA or AI (or sodium CDRR) with Tolerable Upper Intake Level when published.',
  asideAriaLabel: 'Interactive Micronutrient Calculator',
  tocItems: MICRONUTRIENT_TOC_ITEMS,
  GuideArticle: MicronutrientGuideArticle,
  faqs: MICRONUTRIENT_FAQS,
  countryRules: null,
};
