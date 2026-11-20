import type { ToolPageDetail } from '@/tools/page-detail';
import { IncomeElasticityOfDemandGuideArticle } from './IncomeElasticityOfDemandGuideArticle';
import {
  INCOME_ELASTICITY_OF_DEMAND_FAQS,
  INCOME_ELASTICITY_OF_DEMAND_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate income elasticity of demand (YED) with Standard or Midpoint methods — how quantity demanded responds to changes in consumer income.',
  asideAriaLabel: 'Interactive Income Elasticity of Demand Calculator',
  tocItems: INCOME_ELASTICITY_OF_DEMAND_TOC_ITEMS,
  GuideArticle: IncomeElasticityOfDemandGuideArticle,
  faqs: INCOME_ELASTICITY_OF_DEMAND_FAQS,
  countryRules: null,
};
