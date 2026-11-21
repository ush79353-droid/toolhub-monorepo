import type { ToolPageDetail } from '@/tools/page-detail';
import { MarginalCostGuideArticle } from './MarginalCostGuideArticle';
import { MARGINAL_COST_FAQS, MARGINAL_COST_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate discrete marginal cost as the change in total cost divided by the change in quantity; incremental cost per unit over a production interval.',
  asideAriaLabel: 'Interactive Marginal Cost Calculator',
  tocItems: MARGINAL_COST_TOC_ITEMS,
  GuideArticle: MarginalCostGuideArticle,
  faqs: MARGINAL_COST_FAQS,
  countryRules: null,
};
