import type { ToolPageDetail } from '@/tools/page-detail';
import { CrossPriceElasticityGuideArticle } from './CrossPriceElasticityGuideArticle';
import { CPE_FAQS, CPE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate how a change in Product A\'s price relates to demand for Product B: E = %ΔQB / %ΔPA; with initial-value or midpoint methods and substitute/complement guidance.',
  asideAriaLabel: 'Interactive Cross Price Elasticity Calculator',
  tocItems: CPE_TOC_ITEMS,
  GuideArticle: CrossPriceElasticityGuideArticle,
  faqs: CPE_FAQS,
  countryRules: null,
};
