import type { ToolPageDetail } from '@/tools/page-detail';
import { TimeUnitGuideArticle } from './TimeUnitGuideArticle';
import { TIME_UNIT_FAQS, TIME_UNIT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert years, months, weeks, days, hours, minutes, and seconds. Average year = 365.25 days; months are 1/12 of that year.',
  asideAriaLabel: 'Interactive time unit converter',
  tocItems: TIME_UNIT_TOC_ITEMS,
  GuideArticle: TimeUnitGuideArticle,
  faqs: TIME_UNIT_FAQS,
  countryRules: null,
};
