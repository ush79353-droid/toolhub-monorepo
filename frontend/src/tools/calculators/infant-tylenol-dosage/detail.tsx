import type { ToolPageDetail } from '@/tools/page-detail';
import { InfantTylenolDosageGuideArticle } from './InfantTylenolDosageGuideArticle';
import { INFANT_TYLENOL_FAQS, INFANT_TYLENOL_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Use our Infant Tylenol Dosage Calculator for an educational US OTC acetaminophen label lookup by weight and product type. Confirm the carton — not medical advice.',
  asideAriaLabel: 'Interactive Infant Tylenol Dosage Calculator',
  tocItems: INFANT_TYLENOL_TOC_ITEMS,
  GuideArticle: InfantTylenolDosageGuideArticle,
  faqs: INFANT_TYLENOL_FAQS,
  countryRules: null,
};
