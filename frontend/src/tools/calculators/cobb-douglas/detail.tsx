import type { ToolPageDetail } from '@/tools/page-detail';
import { CobbDouglasGuideArticle } from './CobbDouglasGuideArticle';
import { COBB_DOUGLAS_FAQS, COBB_DOUGLAS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate total production using labor, capital, total factor productivity, and output elasticity coefficients.',
  asideAriaLabel: 'Interactive Cobb-Douglas Production Function Calculator',
  tocItems: COBB_DOUGLAS_TOC_ITEMS,
  GuideArticle: CobbDouglasGuideArticle,
  faqs: COBB_DOUGLAS_FAQS,
  countryRules: null,
};
