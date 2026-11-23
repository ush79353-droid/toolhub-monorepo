import type { ToolPageDetail } from '@/tools/page-detail';
import { SpermAnalysisGuideArticle } from './SpermAnalysisGuideArticle';
import { SPERM_ANALYSIS_FAQS, SPERM_ANALYSIS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational total and functional sperm counts from volume, concentration, and optional morphology, motility, and vitality percentages — not a fertility diagnosis.',
  asideAriaLabel: 'Interactive Sperm Analysis Calculator',
  tocItems: SPERM_ANALYSIS_TOC_ITEMS,
  GuideArticle: SpermAnalysisGuideArticle,
  faqs: SPERM_ANALYSIS_FAQS,
  countryRules: null,
};
