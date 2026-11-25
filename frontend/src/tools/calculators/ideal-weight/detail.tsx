import type { ToolPageDetail } from '@/tools/page-detail';
import { IdealWeightGuideArticle } from './IdealWeightGuideArticle';
import { IDEAL_WEIGHT_FAQS, IDEAL_WEIGHT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate adult ideal body weight with Devine, Robinson, Miller, and Hamwi formulas from height and sex — educational only.',
  asideAriaLabel: 'Interactive Ideal Weight Calculator',
  tocItems: IDEAL_WEIGHT_TOC_ITEMS,
  GuideArticle: IdealWeightGuideArticle,
  faqs: IDEAL_WEIGHT_FAQS,
  countryRules: null,
};
