import type { ToolPageDetail } from '@/tools/page-detail';
import { HoursToYearsGuideArticle } from './HoursToYearsGuideArticle';
import { HOURS_TO_YEARS_FAQS, HOURS_TO_YEARS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert hours to years instantly (and years back to hours) using the average Gregorian year, with months, weeks, days, minutes, and seconds.',
  asideAriaLabel: 'Interactive hours to years converter',
  tocItems: HOURS_TO_YEARS_TOC_ITEMS,
  GuideArticle: HoursToYearsGuideArticle,
  faqs: HOURS_TO_YEARS_FAQS,
  countryRules: null,
};
