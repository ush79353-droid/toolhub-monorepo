import type { ToolPageDetail } from '@/tools/page-detail';
import { WeekOverWeekGuideArticle } from './WeekOverWeekGuideArticle';
import { WEEK_OVER_WEEK_FAQS, WEEK_OVER_WEEK_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Measure week-over-week percentage change from an initial week value to the following week.',
  asideAriaLabel: 'Interactive Week Over Week Calculator',
  tocItems: WEEK_OVER_WEEK_TOC_ITEMS,
  GuideArticle: WeekOverWeekGuideArticle,
  faqs: WEEK_OVER_WEEK_FAQS,
  countryRules: null,
};
