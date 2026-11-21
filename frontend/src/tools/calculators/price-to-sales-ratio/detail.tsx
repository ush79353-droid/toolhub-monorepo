import type { ToolPageDetail } from '@/tools/page-detail';
import { PriceToSalesGuideArticle } from './PriceToSalesGuideArticle';
import { PRICE_TO_SALES_FAQS, PRICE_TO_SALES_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate sales per share and the price-to-sales (P/S) ratio with independent FX on each money field.',
  asideAriaLabel: 'Interactive Price to Sales Ratio Calculator',
  tocItems: PRICE_TO_SALES_TOC_ITEMS,
  GuideArticle: PriceToSalesGuideArticle,
  faqs: PRICE_TO_SALES_FAQS,
  countryRules: null,
};
