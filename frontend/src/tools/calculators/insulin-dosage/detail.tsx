import type { ToolPageDetail } from '@/tools/page-detail';
import { InsulinDosageGuideArticle } from './InsulinDosageGuideArticle';
import { INSULIN_DOSAGE_FAQS, INSULIN_DOSAGE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational mealtime insulin arithmetic: carbohydrate coverage, correction bolus, and total units from care-plan settings you enter. Not a prescription — confirm every dose with your clinician.',
  asideAriaLabel: 'Interactive Insulin Dosage Calculator',
  tocItems: INSULIN_DOSAGE_TOC_ITEMS,
  GuideArticle: InsulinDosageGuideArticle,
  faqs: INSULIN_DOSAGE_FAQS,
  countryRules: null,
};
