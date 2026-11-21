import type { ToolPageDetail } from '@/tools/page-detail';
import { AnnualSalaryGuideArticle } from './AnnualSalaryGuideArticle';
import { ANNUAL_SALARY_FAQS, ANNUAL_SALARY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert hourly wage to annual salary from hours and weeks worked, then estimate net pay after a simplified flat tax with independent FX on each money field.',
  asideAriaLabel: 'Interactive Annual Salary Calculator',
  tocItems: ANNUAL_SALARY_TOC_ITEMS,
  GuideArticle: AnnualSalaryGuideArticle,
  faqs: ANNUAL_SALARY_FAQS,
  countryRules: null,
};
