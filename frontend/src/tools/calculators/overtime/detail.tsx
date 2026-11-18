import type { ToolPageDetail } from '@/tools/page-detail';
import { OvertimeGuideArticle } from './OvertimeGuideArticle';
import { OVERTIME_FAQS, OVERTIME_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate regular pay, overtime premium, and total pay from your hourly rate, weekly schedule, and overtime hours, with real currency conversion.',
  asideAriaLabel: 'Interactive Overtime Calculator',
  tocItems: OVERTIME_TOC_ITEMS,
  GuideArticle: OvertimeGuideArticle,
  faqs: OVERTIME_FAQS,
  countryRules: null,
};
