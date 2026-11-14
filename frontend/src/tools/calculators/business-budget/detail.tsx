import type { ToolPageDetail } from '@/tools/page-detail';
import { BusinessBudgetGuideArticle } from './BusinessBudgetGuideArticle';
import { BUSINESS_BUDGET_FAQS, BUSINESS_BUDGET_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Plan operating and non-operating income, one-time costs, salaries, and monthly expenses to see your monthly budget balance.',
  asideAriaLabel: 'Interactive business budget calculator',
  tocItems: BUSINESS_BUDGET_TOC_ITEMS,
  GuideArticle: BusinessBudgetGuideArticle,
  faqs: BUSINESS_BUDGET_FAQS,
  countryRules: null,
};
