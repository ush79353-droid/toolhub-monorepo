import type { ToolPageDetail } from '@/tools/page-detail';
import { CostFunctionGuideArticle } from './CostFunctionGuideArticle';
import { COST_FUNCTION_FAQS, COST_FUNCTION_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Build a linear cost function from fixed and variable costs, or estimate fixed and variable costs from two total-cost points. Currency changes the denomination only.',
  asideAriaLabel: 'Interactive cost function calculator',
  tocItems: COST_FUNCTION_TOC_ITEMS,
  GuideArticle: CostFunctionGuideArticle,
  faqs: COST_FUNCTION_FAQS,
  countryRules: null,
};
