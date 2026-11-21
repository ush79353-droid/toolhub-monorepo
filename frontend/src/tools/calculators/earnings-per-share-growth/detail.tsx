import type { ToolPageDetail } from '@/tools/page-detail';
import { EarningsPerShareGrowthGuideArticle } from './EarningsPerShareGrowthGuideArticle';
import { EPS_GROWTH_FAQS, EPS_GROWTH_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Measure total earnings per share growth and annualized EPS CAGR between two periods.',
  asideAriaLabel: 'Interactive Earnings Per Share Growth Calculator',
  tocItems: EPS_GROWTH_TOC_ITEMS,
  GuideArticle: EarningsPerShareGrowthGuideArticle,
  faqs: EPS_GROWTH_FAQS,
  countryRules: null,
};
