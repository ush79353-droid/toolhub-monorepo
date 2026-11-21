import type { ToolPageDetail } from '@/tools/page-detail';
import { ParacetamolDosageGuideArticle } from './ParacetamolDosageGuideArticle';
import {
  PARACETAMOL_DOSAGE_FAQS,
  PARACETAMOL_DOSAGE_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Use our Paracetamol Dosage Calculator for educational pediatric mg/kg ceilings from age and weight, with links to product-form helpers. Always follow the leaflet and a clinician.',
  asideAriaLabel: 'Interactive Paracetamol Dosage Calculator',
  tocItems: PARACETAMOL_DOSAGE_TOC_ITEMS,
  GuideArticle: ParacetamolDosageGuideArticle,
  faqs: PARACETAMOL_DOSAGE_FAQS,
  countryRules: null,
};
