import type { ToolPageDetail } from '@/tools/page-detail';
import { SalaryWithOvertimeGuideArticle } from './SalaryWithOvertimeGuideArticle';
import { SALARY_WITH_OVERTIME_FAQS, SALARY_WITH_OVERTIME_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate salary with overtime from regular wages, hours, and a multiplier with independent FX on money fields.',
  asideAriaLabel: 'Interactive Salary Calculator With Overtime',
  tocItems: SALARY_WITH_OVERTIME_TOC_ITEMS,
  GuideArticle: SalaryWithOvertimeGuideArticle,
  faqs: SALARY_WITH_OVERTIME_FAQS,
  countryRules: null,
};
