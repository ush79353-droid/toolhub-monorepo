import type { ToolPageDetail } from '@/tools/page-detail';
import { YearOverYearGrowthGuideArticle } from './YearOverYearGrowthGuideArticle';
import { YEAR_OVER_YEAR_GROWTH_FAQS, YEAR_OVER_YEAR_GROWTH_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead: 'Measure year-over-year percent change, with optional CAGR for multi-year spans.',
  asideAriaLabel: 'Interactive Year Over Year Growth Calculator',
  tocItems: YEAR_OVER_YEAR_GROWTH_TOC_ITEMS,
  GuideArticle: YearOverYearGrowthGuideArticle,
  faqs: YEAR_OVER_YEAR_GROWTH_FAQS,
  countryRules: null,
};
