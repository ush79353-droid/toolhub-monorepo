import type { ToolPageDetail } from '@/tools/page-detail';
import { IllinoisOvertimeGuideArticle } from './IllinoisOvertimeGuideArticle';
import { ILLINOIS_OVERTIME_FAQS, ILLINOIS_OVERTIME_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate Illinois overtime pay from regular wages, weekly hours, and an overtime multiplier with independent FX on money fields.',
  asideAriaLabel: 'Interactive Illinois Overtime Calculator',
  tocItems: ILLINOIS_OVERTIME_TOC_ITEMS,
  GuideArticle: IllinoisOvertimeGuideArticle,
  faqs: ILLINOIS_OVERTIME_FAQS,
  countryRules: null,
};
