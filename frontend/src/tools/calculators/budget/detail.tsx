import type { ToolPageDetail } from '@/tools/page-detail';
import { BudgetGuideArticle } from './BudgetGuideArticle';
import { BUDGET_FAQS, BUDGET_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Build a personal budget from income, savings, and monthly/annual expenses — with independent FX and / mo · / yr frequencies on every money line.',
  asideAriaLabel: 'Interactive Budget Calculator',
  tocItems: BUDGET_TOC_ITEMS,
  GuideArticle: BudgetGuideArticle,
  faqs: BUDGET_FAQS,
  countryRules: null,
};
