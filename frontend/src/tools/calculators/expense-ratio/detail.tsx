import type { ToolPageDetail } from '@/tools/page-detail';
import { ExpenseRatioGuideArticle } from './ExpenseRatioGuideArticle';
import { EXPENSE_RATIO_FAQS, EXPENSE_RATIO_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead: 'Estimate investment growth and the long-term cost of an ETF expense ratio.',
  asideAriaLabel: 'Interactive Expense Ratio Calculator',
  tocItems: EXPENSE_RATIO_TOC_ITEMS,
  GuideArticle: ExpenseRatioGuideArticle,
  faqs: EXPENSE_RATIO_FAQS,
  countryRules: null,
};
