import type { ToolPageDetail } from '@/tools/page-detail';
import { OvertimePaycheckGuideArticle } from './OvertimePaycheckGuideArticle';
import { OVERTIME_FAQS, OVERTIME_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate regular pay, overtime premium, and total paycheck from your hourly rate, weekly schedule, and overtime hours, with real currency conversion.',
  asideAriaLabel: 'Interactive Overtime Paycheck Calculator',
  tocItems: OVERTIME_TOC_ITEMS,
  GuideArticle: OvertimePaycheckGuideArticle,
  faqs: OVERTIME_FAQS,
  countryRules: null,
};
