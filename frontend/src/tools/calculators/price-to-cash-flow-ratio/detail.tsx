import type { ToolPageDetail } from '@/tools/page-detail';
import { PriceToCashFlowGuideArticle } from './PriceToCashFlowGuideArticle';
import {
  PRICE_TO_CASH_FLOW_FAQS,
  PRICE_TO_CASH_FLOW_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate cash flow per share and the price-to-cash-flow (P/CF) ratio with independent FX on each money field.',
  asideAriaLabel: 'Interactive Price to Cash Flow Ratio Calculator',
  tocItems: PRICE_TO_CASH_FLOW_TOC_ITEMS,
  GuideArticle: PriceToCashFlowGuideArticle,
  faqs: PRICE_TO_CASH_FLOW_FAQS,
  countryRules: null,
};
