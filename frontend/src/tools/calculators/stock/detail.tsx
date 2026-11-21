import type { ToolPageDetail } from '@/tools/page-detail';
import { StockGuideArticle } from './StockGuideArticle';
import { STOCK_FAQS, STOCK_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate stock trade profit, ROI, and break-even selling price after percent brokerage commissions, with independent FX on each money field.',
  asideAriaLabel: 'Interactive Stock Calculator',
  tocItems: STOCK_TOC_ITEMS,
  GuideArticle: StockGuideArticle,
  faqs: STOCK_FAQS,
  countryRules: null,
};
