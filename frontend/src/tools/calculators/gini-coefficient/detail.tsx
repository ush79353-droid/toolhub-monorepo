import type { ToolPageDetail } from '@/tools/page-detail';
import { GiniGuideArticle } from './GiniGuideArticle';
import { GINI_FAQS, GINI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate the Gini coefficient from Lorenz curve areas A and B, explore the Gini index, and interpret inequality with formulas and worked examples.',
  asideAriaLabel: 'Interactive Gini Coefficient Calculator',
  tocItems: GINI_TOC_ITEMS,
  GuideArticle: GiniGuideArticle,
  faqs: GINI_FAQS,
  countryRules: null,
};
