import type { ToolPageDetail } from '@/tools/page-detail';
import { NetIncomeGuideArticle } from './NetIncomeGuideArticle';
import { NET_INCOME_FAQS, NET_INCOME_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate net income after taxes from revenue, cost of sales, operating expenses, interest, and an estimated effective tax rate.',
  asideAriaLabel: 'Interactive Net Income Calculator',
  tocItems: NET_INCOME_TOC_ITEMS,
  GuideArticle: NetIncomeGuideArticle,
  faqs: NET_INCOME_FAQS,
  countryRules: null,
};
