import type { ToolPageDetail } from '@/tools/page-detail';
import { HourlyToSalaryWithOvertimeGuideArticle } from './HourlyToSalaryWithOvertimeGuideArticle';
import {
  HOURLY_TO_SALARY_WITH_OVERTIME_FAQS,
  HOURLY_TO_SALARY_WITH_OVERTIME_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert hourly pay into regular, overtime, and total salary with independent FX; defaults to 40 hours per week.',
  asideAriaLabel: 'Interactive Hourly to Salary with Overtime Calculator',
  tocItems: HOURLY_TO_SALARY_WITH_OVERTIME_TOC_ITEMS,
  GuideArticle: HourlyToSalaryWithOvertimeGuideArticle,
  faqs: HOURLY_TO_SALARY_WITH_OVERTIME_FAQS,
  countryRules: null,
};
