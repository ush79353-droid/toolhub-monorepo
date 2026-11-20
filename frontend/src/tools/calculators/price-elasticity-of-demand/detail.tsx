import type { ToolPageDetail } from '@/tools/page-detail';
import { PriceElasticityOfDemandGuideArticle } from './PriceElasticityOfDemandGuideArticle';
import {
  PRICE_ELASTICITY_OF_DEMAND_FAQS,
  PRICE_ELASTICITY_OF_DEMAND_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Measure midpoint (arc) price elasticity of demand from two price–quantity observations, classify the result, and compare initial and final revenue.',
  asideAriaLabel: 'Interactive Price Elasticity of Demand Calculator',
  tocItems: PRICE_ELASTICITY_OF_DEMAND_TOC_ITEMS,
  GuideArticle: PriceElasticityOfDemandGuideArticle,
  faqs: PRICE_ELASTICITY_OF_DEMAND_FAQS,
  countryRules: null,
};
