import type { ToolPageDetail } from '@/tools/page-detail';
import { DaysToYearsGuideArticle } from './DaysToYearsGuideArticle';
import { DAYS_TO_YEARS_FAQS, DAYS_TO_YEARS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert days to average Gregorian years — and reverse — using 365.2425 days per year. Duration math, not calendar-date spans.',
  asideAriaLabel: 'Interactive days to years calculator',
  tocItems: DAYS_TO_YEARS_TOC_ITEMS,
  GuideArticle: DaysToYearsGuideArticle,
  faqs: DAYS_TO_YEARS_FAQS,
  countryRules: null,
};
