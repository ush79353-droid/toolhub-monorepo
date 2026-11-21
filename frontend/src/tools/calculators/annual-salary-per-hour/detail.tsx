import type { ToolPageDetail } from '@/tools/page-detail';
import { AnnualSalaryPerHourGuideArticle } from './AnnualSalaryPerHourGuideArticle';
import {
  ANNUAL_SALARY_PER_HOUR_FAQS,
  ANNUAL_SALARY_PER_HOUR_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert between hourly, daily, weekly, monthly, and annual wages from hours per week. Enter any one amount with independent FX on each field.',
  asideAriaLabel: 'Interactive Annual Salary per Hour Calculator',
  tocItems: ANNUAL_SALARY_PER_HOUR_TOC_ITEMS,
  GuideArticle: AnnualSalaryPerHourGuideArticle,
  faqs: ANNUAL_SALARY_PER_HOUR_FAQS,
  countryRules: null,
};
