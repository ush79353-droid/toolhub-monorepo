import type { ToolPageDetail } from '@/tools/page-detail';
import { SavingsPlanGuideArticle } from './SavingsPlanGuideArticle';
import { SAVINGS_PLAN_FAQS, SAVINGS_PLAN_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Plan fixed or growing periodic deposits — or reverse-solve the deposit needed for a target final balance — with independent FX on money fields, a principal growth chart, and period-by-period balances. No invented interest.',
  asideAriaLabel: 'Interactive Savings Plan Calculator',
  tocItems: SAVINGS_PLAN_TOC_ITEMS,
  GuideArticle: SavingsPlanGuideArticle,
  faqs: SAVINGS_PLAN_FAQS,
  countryRules: null,
};
