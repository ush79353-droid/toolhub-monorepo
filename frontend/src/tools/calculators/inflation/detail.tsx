import type { ToolPageDetail } from '@/tools/page-detail';
import { InflationGuideArticle } from './InflationGuideArticle';
import { INFLATION_FAQS, INFLATION_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate inflation between years using CPI data or custom rates. Compare purchasing power, cumulative inflation, and inflation-adjusted money values.',
  asideAriaLabel: 'Interactive Inflation Calculator',
  tocItems: INFLATION_TOC_ITEMS,
  GuideArticle: InflationGuideArticle,
  faqs: INFLATION_FAQS,
  countryRules: null,
};
