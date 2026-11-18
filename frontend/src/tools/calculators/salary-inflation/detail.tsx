import type { ToolPageDetail } from '@/tools/page-detail';
import { SalaryInflationGuideArticle } from './SalaryInflationGuideArticle';
import {
  SALARY_INFLATION_FAQS,
  SALARY_INFLATION_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare your current salary to a single-period inflation-adjusted reference salary and see whether you gained or lost purchasing power — with independent currency conversion on every money field.',
  asideAriaLabel: 'Interactive Salary Inflation Calculator',
  tocItems: SALARY_INFLATION_TOC_ITEMS,
  GuideArticle: SalaryInflationGuideArticle,
  faqs: SALARY_INFLATION_FAQS,
  countryRules: null,
};
