import type { ToolPageDetail } from '@/tools/page-detail';
import { HourlyToAnnualSalaryGuideArticle } from './HourlyToAnnualSalaryGuideArticle';
import {
  HOURLY_TO_ANNUAL_SALARY_FAQS,
  HOURLY_TO_ANNUAL_SALARY_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert an hourly wage into weekly, monthly, and annual salary from hours and days per week — with independent currency conversion on every money field.',
  asideAriaLabel: 'Interactive Hourly to Annual Salary Calculator',
  tocItems: HOURLY_TO_ANNUAL_SALARY_TOC_ITEMS,
  GuideArticle: HourlyToAnnualSalaryGuideArticle,
  faqs: HOURLY_TO_ANNUAL_SALARY_FAQS,
  countryRules: null,
};
