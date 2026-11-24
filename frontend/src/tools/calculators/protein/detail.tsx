import type { ToolPageDetail } from '@/tools/page-detail';
import { ProteinGuideArticle } from './ProteinGuideArticle';
import { PROTEIN_FAQS, PROTEIN_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Daily protein targets from IOM g/kg RDA and AMDR energy shares, with optional ACSM sport bands.',
  asideAriaLabel: 'Interactive Protein Calculator',
  tocItems: PROTEIN_TOC_ITEMS,
  GuideArticle: ProteinGuideArticle,
  faqs: PROTEIN_FAQS,
  countryRules: null,
};
