import type { ToolPageDetail } from '@/tools/page-detail';
import { FisherEquationGuideArticle } from './FisherEquationGuideArticle';
import {
  FISHER_EQUATION_FAQS,
  FISHER_EQUATION_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate real and nominal interest rates or expected inflation using the Fisher equation, with exact and approximate results.',
  asideAriaLabel: 'Interactive Fisher Equation Calculator',
  tocItems: FISHER_EQUATION_TOC_ITEMS,
  GuideArticle: FisherEquationGuideArticle,
  faqs: FISHER_EQUATION_FAQS,
  countryRules: null,
};
