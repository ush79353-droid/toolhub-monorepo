import type { ToolPageDetail } from '@/tools/page-detail';
import { RevenueGrowthGuideArticle } from './RevenueGrowthGuideArticle';
import { REVENUE_GROWTH_FAQS, REVENUE_GROWTH_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Measure total revenue growth and the compound growth rate per period, with independent FX on each money field.',
  asideAriaLabel: 'Interactive Revenue Growth Calculator',
  tocItems: REVENUE_GROWTH_TOC_ITEMS,
  GuideArticle: RevenueGrowthGuideArticle,
  faqs: REVENUE_GROWTH_FAQS,
  countryRules: null,
};
