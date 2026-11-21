import type { ToolPageDetail } from '@/tools/page-detail';
import { WageToSalaryGuideArticle } from './WageToSalaryGuideArticle';
import { WAGE_TO_SALARY_FAQS, WAGE_TO_SALARY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert an hourly, daily, or weekly wage into monthly and yearly salary using hours and days per week, with independent currency conversion on every money field.',
  asideAriaLabel: 'Interactive Wage to Salary Calculator',
  tocItems: WAGE_TO_SALARY_TOC_ITEMS,
  GuideArticle: WageToSalaryGuideArticle,
  faqs: WAGE_TO_SALARY_FAQS,
  countryRules: null,
};
