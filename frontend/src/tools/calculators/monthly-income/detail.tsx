import type { ToolPageDetail } from '@/tools/page-detail';
import { MonthlyIncomeGuideArticle } from './MonthlyIncomeGuideArticle';
import { MONTHLY_INCOME_FAQS, MONTHLY_INCOME_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert hourly, daily, weekly, or yearly earnings into monthly income using your working schedule, with independent currency conversion on every money field.',
  asideAriaLabel: 'Interactive Monthly Income Calculator',
  tocItems: MONTHLY_INCOME_TOC_ITEMS,
  GuideArticle: MonthlyIncomeGuideArticle,
  faqs: MONTHLY_INCOME_FAQS,
  countryRules: null,
};
