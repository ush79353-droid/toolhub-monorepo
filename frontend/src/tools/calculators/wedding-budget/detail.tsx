import type { ToolPageDetail } from '@/tools/page-detail';
import { WeddingBudgetGuideArticle } from './WeddingBudgetGuideArticle';
import { WEDDING_BUDGET_FAQS, WEDDING_BUDGET_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Plan wedding spending by category, add custom expenses, and see cost per guest plus budget balance—with independent FX on money fields.',
  asideAriaLabel: 'Interactive Wedding Budget Calculator',
  tocItems: WEDDING_BUDGET_TOC_ITEMS,
  GuideArticle: WeddingBudgetGuideArticle,
  faqs: WEDDING_BUDGET_FAQS,
  countryRules: null,
};
