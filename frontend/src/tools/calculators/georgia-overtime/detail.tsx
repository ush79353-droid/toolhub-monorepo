import type { ToolPageDetail } from '@/tools/page-detail';
import { GeorgiaOvertimeGuideArticle } from './GeorgiaOvertimeGuideArticle';
import {
  GEORGIA_OVERTIME_FAQS,
  GEORGIA_OVERTIME_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate regular and overtime pay from an hourly-style rate, schedule, and 1.5× multiplier — with real FX. Not a Georgia legal-compliance engine.',
  asideAriaLabel: 'Interactive Georgia Overtime Calculator',
  tocItems: GEORGIA_OVERTIME_TOC_ITEMS,
  GuideArticle: GeorgiaOvertimeGuideArticle,
  faqs: GEORGIA_OVERTIME_FAQS,
  countryRules: null,
};
