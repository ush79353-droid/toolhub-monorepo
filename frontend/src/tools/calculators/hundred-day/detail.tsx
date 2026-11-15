import type { ToolPageDetail } from '@/tools/page-detail';
import { HUNDRED_DAY_FAQS, HUNDRED_DAY_TOC_ITEMS } from './content';
import { HundredDayGuideArticle } from './HundredDayGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Find the date 100 days after or before any day, or count calendar days between two dates, including leap years and inclusive counting.',
  asideAriaLabel: 'Interactive 100 day calculator',
  tocItems: HUNDRED_DAY_TOC_ITEMS,
  GuideArticle: HundredDayGuideArticle,
  faqs: HUNDRED_DAY_FAQS,
  countryRules: null,
};
