import type { ToolPageDetail } from '@/tools/page-detail';
import { BidensTaxPlanGuideArticle } from './BidensTaxPlanGuideArticle';
import { BIDENS_TAX_PLAN_FAQS, BIDENS_TAX_PLAN_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Historical Biden Tax Plan Comparison — simplified TY2022 TCJA baseline vs the May 2021 American Families Plan ordinary-rate and Child Tax Credit proposals (fixed USD educational estimate).',
  asideAriaLabel: "Interactive Biden's Tax Plan Calculator",
  tocItems: BIDENS_TAX_PLAN_TOC_ITEMS,
  GuideArticle: BidensTaxPlanGuideArticle,
  faqs: BIDENS_TAX_PLAN_FAQS,
  countryRules: null,
};
