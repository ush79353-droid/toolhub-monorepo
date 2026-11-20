import type { ToolPageDetail } from '@/tools/page-detail';
import { PriceToEarningsGuideArticle } from './PriceToEarningsGuideArticle';
import { PE_FAQS, PE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate a stock’s price-to-earnings (P/E) ratio from share price and earnings per share — with optional EPS from net income, preferred dividends, and shares.',
  asideAriaLabel: 'Interactive Price to Earnings Ratio Calculator',
  tocItems: PE_TOC_ITEMS,
  GuideArticle: PriceToEarningsGuideArticle,
  faqs: PE_FAQS,
  countryRules: null,
};
