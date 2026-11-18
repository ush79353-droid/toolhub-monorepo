import type { ToolPageDetail } from '@/tools/page-detail';
import { AnnualToMonthlySalaryGuideArticle } from './AnnualToMonthlySalaryGuideArticle';
import {
  ANNUAL_TO_MONTHLY_SALARY_FAQS,
  ANNUAL_TO_MONTHLY_SALARY_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert an annual salary into monthly, weekly, daily, and hourly wages from hours per week — with independent FX on each money field.',
  asideAriaLabel: 'Interactive Annual to Monthly Salary Calculator',
  tocItems: ANNUAL_TO_MONTHLY_SALARY_TOC_ITEMS,
  GuideArticle: AnnualToMonthlySalaryGuideArticle,
  faqs: ANNUAL_TO_MONTHLY_SALARY_FAQS,
  countryRules: null,
};
