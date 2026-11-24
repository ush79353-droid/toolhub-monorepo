import type { ToolPageDetail } from '@/tools/page-detail';
import { PeptideGuideArticle } from './PeptideGuideArticle';
import { PEPTIDE_FAQS, PEPTIDE_TOC } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Labeled-product syringe volume arithmetic with explicit barrel calibration — educational only.',
  asideAriaLabel: 'Interactive Peptide Calculator',
  tocItems: PEPTIDE_TOC,
  GuideArticle: PeptideGuideArticle,
  faqs: PEPTIDE_FAQS,
  countryRules: null,
};
