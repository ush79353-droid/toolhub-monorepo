import type { ToolPageDetail } from '@/tools/page-detail';
import { HourlyWageGuideArticle } from './HourlyWageGuideArticle';
import { HOURLY_WAGE_FAQS, HOURLY_WAGE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert an hourly wage into per-second, per-minute, daily, weekly, biweekly, monthly, and annual pay using 5 working days per week and 52 paid weeks per year.',
  asideAriaLabel: 'Interactive Hourly Wage Calculator',
  tocItems: HOURLY_WAGE_TOC_ITEMS,
  GuideArticle: HourlyWageGuideArticle,
  faqs: HOURLY_WAGE_FAQS,
  countryRules: null,
};
