import type { ToolPageDetail } from '@/tools/page-detail';
import { StockSplitGuideArticle } from './StockSplitGuideArticle';
import { STOCK_SPLIT_FAQS, STOCK_SPLIT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Model forward or reverse A-for-B stock splits to see new share count, adjusted price, and preserved portfolio value, with independent FX on price fields.',
  asideAriaLabel: 'Interactive Stock Split Calculator',
  tocItems: STOCK_SPLIT_TOC_ITEMS,
  GuideArticle: StockSplitGuideArticle,
  faqs: STOCK_SPLIT_FAQS,
  countryRules: null,
};
