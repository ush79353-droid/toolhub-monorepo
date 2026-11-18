import type { ToolPageDetail } from '@/tools/page-detail';
import { SalaryGuideArticle } from './SalaryGuideArticle';
import { SALARY_FAQS, SALARY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert hourly pay into daily, weekly, monthly, and annual salary from your work schedule — with independent currency conversion on every money field.',
  asideAriaLabel: 'Interactive Salary Calculator',
  tocItems: SALARY_TOC_ITEMS,
  GuideArticle: SalaryGuideArticle,
  faqs: SALARY_FAQS,
  countryRules: null,
};
