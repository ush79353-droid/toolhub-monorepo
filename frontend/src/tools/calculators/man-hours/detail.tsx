import type { ToolPageDetail } from '@/tools/page-detail';
import { ManHoursGuideArticle } from './ManHoursGuideArticle';
import { MAN_HOURS_FAQS, MAN_HOURS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate total man-hours and labor cost from headcount, hours per person, and hourly pay.',
  asideAriaLabel: 'Interactive man-hours calculator',
  tocItems: MAN_HOURS_TOC_ITEMS,
  GuideArticle: ManHoursGuideArticle,
  faqs: MAN_HOURS_FAQS,
  countryRules: null,
};
