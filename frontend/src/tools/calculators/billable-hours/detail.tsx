import type { ToolPageDetail } from '@/tools/page-detail';
import { BillableHoursGuideArticle } from './BillableHoursGuideArticle';
import { BILLABLE_HOURS_FAQS, BILLABLE_HOURS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Solve billable rate, time, or value from any two inputs, with independent FX on money fields.',
  asideAriaLabel: 'Interactive Billable Hours Calculator',
  tocItems: BILLABLE_HOURS_TOC_ITEMS,
  GuideArticle: BillableHoursGuideArticle,
  faqs: BILLABLE_HOURS_FAQS,
  countryRules: null,
};
