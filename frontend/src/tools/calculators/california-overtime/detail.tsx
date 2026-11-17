import type { ToolPageDetail } from '@/tools/page-detail';
import { CaliforniaOvertimeGuideArticle } from './CaliforniaOvertimeGuideArticle';
import {
  CALIFORNIA_OVERTIME_FAQS,
  CALIFORNIA_OVERTIME_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate regular and overtime pay from an hourly-style rate, schedule, and 1.5× multiplier — with real FX. Not a California legal-compliance engine.',
  asideAriaLabel: 'Interactive California Overtime Calculator',
  tocItems: CALIFORNIA_OVERTIME_TOC_ITEMS,
  GuideArticle: CaliforniaOvertimeGuideArticle,
  faqs: CALIFORNIA_OVERTIME_FAQS,
  countryRules: null,
};
