import type { ToolPageDetail } from '@/tools/page-detail';
import { DimensionalAnalysisGuideArticle } from './DimensionalAnalysisGuideArticle';
import { DA_FAQS, DA_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare measurements or convert units across SI base and derived quantities, with dimensional formulas and compatibility checks.',
  asideAriaLabel: 'Interactive dimensional analysis calculator',
  tocItems: DA_TOC_ITEMS,
  GuideArticle: DimensionalAnalysisGuideArticle,
  faqs: DA_FAQS,
  countryRules: null,
};
