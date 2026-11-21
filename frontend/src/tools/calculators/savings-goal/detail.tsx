import type { ToolPageDetail } from '@/tools/page-detail';
import { SavingsGoalGuideArticle } from './SavingsGoalGuideArticle';
import { SAVINGS_GOAL_FAQS, SAVINGS_GOAL_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Find the recurring deposit needed to reach a savings goal by a target age or year horizon, with compounding, inflation, deposit growth, and real FX on money fields.',
  asideAriaLabel: 'Interactive Savings Goal Calculator',
  tocItems: SAVINGS_GOAL_TOC_ITEMS,
  GuideArticle: SavingsGoalGuideArticle,
  faqs: SAVINGS_GOAL_FAQS,
  countryRules: null,
};
