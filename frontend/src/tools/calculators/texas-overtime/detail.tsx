import type { ToolPageDetail } from '@/tools/page-detail';
import { TexasOvertimeGuideArticle } from './TexasOvertimeGuideArticle';
import { TEXAS_OVERTIME_FAQS, TEXAS_OVERTIME_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate Texas overtime pay from regular wages, weekly hours, and an overtime multiplier with independent FX on money fields.',
  asideAriaLabel: 'Interactive Texas Overtime Calculator',
  tocItems: TEXAS_OVERTIME_TOC_ITEMS,
  GuideArticle: TexasOvertimeGuideArticle,
  faqs: TEXAS_OVERTIME_FAQS,
  countryRules: null,
};
