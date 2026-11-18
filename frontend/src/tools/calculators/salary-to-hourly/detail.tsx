import type { ToolPageDetail } from '@/tools/page-detail';
import { SalaryToHourlyGuideArticle } from './SalaryToHourlyGuideArticle';
import {
  SALARY_TO_HOURLY_FAQS,
  SALARY_TO_HOURLY_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert annual salary to hourly wage from hours per week, then see daily, weekly, biweekly, and monthly pay — with independent FX on every money field.',
  asideAriaLabel: 'Interactive Salary to Hourly Calculator',
  tocItems: SALARY_TO_HOURLY_TOC_ITEMS,
  GuideArticle: SalaryToHourlyGuideArticle,
  faqs: SALARY_TO_HOURLY_FAQS,
  countryRules: null,
};
