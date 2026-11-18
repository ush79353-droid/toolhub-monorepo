import type { ToolPageDetail } from '@/tools/page-detail';
import { FloridaOvertimeGuideArticle } from './FloridaOvertimeGuideArticle';
import { FLORIDA_OVERTIME_FAQS, FLORIDA_OVERTIME_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate Florida overtime pay from regular wages, weekly hours, and an overtime multiplier with independent FX on money fields.',
  asideAriaLabel: 'Interactive Florida Overtime Calculator',
  tocItems: FLORIDA_OVERTIME_TOC_ITEMS,
  GuideArticle: FloridaOvertimeGuideArticle,
  faqs: FLORIDA_OVERTIME_FAQS,
  countryRules: null,
};
