import type { ToolPageDetail } from '@/tools/page-detail';
import { HourlyToSalaryWageGuideArticle } from './HourlyToSalaryWageGuideArticle';
import {
  HOURLY_TO_SALARY_WAGE_FAQS,
  HOURLY_TO_SALARY_WAGE_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert between hourly wage and annual salary from hours per week, then see daily, weekly, biweekly, and monthly pay — with independent FX on every money field.',
  asideAriaLabel: 'Interactive Hourly to Salary - Wage Calculator',
  tocItems: HOURLY_TO_SALARY_WAGE_TOC_ITEMS,
  GuideArticle: HourlyToSalaryWageGuideArticle,
  faqs: HOURLY_TO_SALARY_WAGE_FAQS,
  countryRules: null,
};
