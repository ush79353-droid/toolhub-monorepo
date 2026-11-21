import type { ToolPageDetail } from '@/tools/page-detail';
import { CpiInflationGuideArticle } from './CpiInflationGuideArticle';
import { CPI_INFLATION_FAQS, CPI_INFLATION_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Use CPI data to compare purchasing power between years and calculate cumulative inflation, average annual inflation, and equivalent money values.',
  asideAriaLabel: 'Interactive CPI Inflation Calculator',
  tocItems: CPI_INFLATION_TOC_ITEMS,
  GuideArticle: CpiInflationGuideArticle,
  faqs: CPI_INFLATION_FAQS,
  countryRules: null,
};
