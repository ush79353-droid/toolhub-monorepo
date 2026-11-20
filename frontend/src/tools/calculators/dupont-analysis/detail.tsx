import type { ToolPageDetail } from '@/tools/page-detail';
import { DupontAnalysisGuideArticle } from './DupontAnalysisGuideArticle';
import { DUPONT_FAQS, DUPONT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Decompose return on equity into net profit margin, asset turnover, and financial leverage with the three-factor DuPont model.',
  asideAriaLabel: 'Interactive DuPont Analysis Calculator',
  tocItems: DUPONT_TOC_ITEMS,
  GuideArticle: DupontAnalysisGuideArticle,
  faqs: DUPONT_FAQS,
  countryRules: null,
};
