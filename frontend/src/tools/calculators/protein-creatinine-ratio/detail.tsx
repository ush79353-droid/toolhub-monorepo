import type { ToolPageDetail } from '@/tools/page-detail';
import { ProteinCreatinineRatioGuideArticle } from './ProteinCreatinineRatioGuideArticle';
import { PROTEIN_CREATININE_FAQS, PROTEIN_CREATININE_TOC } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate urine protein-to-creatinine ratio (UPCR) from a spot sample — educational, not a timed 24-hour collection or diagnosis.',
  asideAriaLabel: 'Interactive Protein Creatinine Ratio Calculator',
  tocItems: PROTEIN_CREATININE_TOC,
  GuideArticle: ProteinCreatinineRatioGuideArticle,
  faqs: PROTEIN_CREATININE_FAQS,
  countryRules: null,
};
