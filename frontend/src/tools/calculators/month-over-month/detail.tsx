import type { ToolPageDetail } from '@/tools/page-detail';
import { MonthOverMonthGuideArticle } from './MonthOverMonthGuideArticle';
import { MONTH_OVER_MONTH_FAQS, MONTH_OVER_MONTH_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Measure month-over-month change, compounding monthly growth rate (CMGR), quarter-over-quarter, and year-over-year percentage growth — independently and in real time.',
  asideAriaLabel: 'Interactive Month-Over-Month Calculator',
  tocItems: MONTH_OVER_MONTH_TOC_ITEMS,
  GuideArticle: MonthOverMonthGuideArticle,
  faqs: MONTH_OVER_MONTH_FAQS,
  countryRules: null,
};
