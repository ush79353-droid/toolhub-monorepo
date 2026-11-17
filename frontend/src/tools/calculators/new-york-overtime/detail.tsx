import type { ToolPageDetail } from '@/tools/page-detail';
import { NewYorkOvertimeGuideArticle } from './NewYorkOvertimeGuideArticle';
import { NEW_YORK_OVERTIME_FAQS, NEW_YORK_OVERTIME_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate regular and overtime pay from an hourly-style rate, schedule, and multiplier — with real FX. Not a New York legal-compliance engine.',
  asideAriaLabel: 'Interactive New York Overtime Calculator',
  tocItems: NEW_YORK_OVERTIME_TOC_ITEMS,
  GuideArticle: NewYorkOvertimeGuideArticle,
  faqs: NEW_YORK_OVERTIME_FAQS,
  countryRules: null,
};
