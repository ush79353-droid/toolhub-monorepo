import type { ToolPageDetail } from '@/tools/page-detail';
import { AverageFixedCostGuideArticle } from './AverageFixedCostGuideArticle';
import { AVERAGE_FIXED_COST_FAQS, AVERAGE_FIXED_COST_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Divide total fixed cost by units produced to get average fixed cost per unit. Currency changes the denomination only.',
  asideAriaLabel: 'Interactive average fixed cost calculator',
  tocItems: AVERAGE_FIXED_COST_TOC_ITEMS,
  GuideArticle: AverageFixedCostGuideArticle,
  faqs: AVERAGE_FIXED_COST_FAQS,
  countryRules: null,
};
