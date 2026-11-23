import type { ToolPageDetail } from '@/tools/page-detail';
import { GorlinFormulaGuideArticle } from './GorlinFormulaGuideArticle';
import { GORLIN_FAQS, GORLIN_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational Gorlin aortic and mitral valve areas from cardiac output, heart rate, open period, and mean gradient.',
  asideAriaLabel: 'Interactive Gorlin Formula Calculator',
  tocItems: GORLIN_TOC_ITEMS,
  GuideArticle: GorlinFormulaGuideArticle,
  faqs: GORLIN_FAQS,
  countryRules: null,
};
