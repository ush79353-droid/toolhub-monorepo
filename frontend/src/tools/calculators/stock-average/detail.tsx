import type { ToolPageDetail } from '@/tools/page-detail';
import { StockAverageGuideArticle } from './StockAverageGuideArticle';
import { STOCK_AVERAGE_FAQS, STOCK_AVERAGE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Find your weighted average buying price across two purchases, then optionally compare it to the current market price for unrealized profit or loss.',
  asideAriaLabel: 'Interactive Stock Average Calculator',
  tocItems: STOCK_AVERAGE_TOC_ITEMS,
  GuideArticle: StockAverageGuideArticle,
  faqs: STOCK_AVERAGE_FAQS,
  countryRules: null,
};
