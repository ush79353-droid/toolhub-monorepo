import type { ToolPageDetail } from '@/tools/page-detail';
import { TylenolDosageGuideArticle } from './TylenolDosageGuideArticle';
import { TYLENOL_DOSAGE_FAQS, TYLENOL_DOSAGE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Look up adult TYLENOL® OTC Drug Facts dosing by symptom and product—Regular/Extra Strength, Sinus Severe, Cold + Flu Severe, and PM—educational only.',
  asideAriaLabel: 'Interactive Tylenol Dosage Calculator',
  tocItems: TYLENOL_DOSAGE_TOC_ITEMS,
  GuideArticle: TylenolDosageGuideArticle,
  faqs: TYLENOL_DOSAGE_FAQS,
  countryRules: null,
};
