import type { ToolPageDetail } from '@/tools/page-detail';
import { MonthsToYearsGuideArticle } from './MonthsToYearsGuideArticle';
import { MONTHS_TO_YEARS_FAQS, MONTHS_TO_YEARS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert months to years and years to months; 1 year = 12 months exactly, with years+months breakdown.',
  asideAriaLabel: 'Interactive months to years calculator',
  tocItems: MONTHS_TO_YEARS_TOC_ITEMS,
  GuideArticle: MonthsToYearsGuideArticle,
  faqs: MONTHS_TO_YEARS_FAQS,
  countryRules: null,
};
