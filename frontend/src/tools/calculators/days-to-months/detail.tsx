import type { ToolPageDetail } from '@/tools/page-detail';
import { DaysToMonthsGuideArticle } from './DaysToMonthsGuideArticle';
import { DAYS_TO_MONTHS_FAQS, DAYS_TO_MONTHS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert days to average Gregorian months — and reverse — with related weeks, hours, minutes, seconds, and years. Months are duration averages, not named calendar months.',
  asideAriaLabel: 'Interactive days to months calculator',
  tocItems: DAYS_TO_MONTHS_TOC_ITEMS,
  GuideArticle: DaysToMonthsGuideArticle,
  faqs: DAYS_TO_MONTHS_FAQS,
  countryRules: null,
};
