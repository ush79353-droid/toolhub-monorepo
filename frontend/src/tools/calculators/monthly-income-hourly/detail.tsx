import type { ToolPageDetail } from '@/tools/page-detail';
import { MonthlyIncomeHourlyGuideArticle } from './MonthlyIncomeHourlyGuideArticle';
import {
  MONTHLY_INCOME_HOURLY_FAQS,
  MONTHLY_INCOME_HOURLY_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert monthly income to an equivalent hourly rate from hours per week (or reverse from hourly) with independent FX on money fields.',
  asideAriaLabel: 'Interactive Monthly Income Hourly Calculator',
  tocItems: MONTHLY_INCOME_HOURLY_TOC_ITEMS,
  GuideArticle: MonthlyIncomeHourlyGuideArticle,
  faqs: MONTHLY_INCOME_HOURLY_FAQS,
  countryRules: null,
};
