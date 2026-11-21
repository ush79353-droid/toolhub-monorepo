import type { ToolPageDetail } from '@/tools/page-detail';
import { CarryTradeGuideArticle } from './CarryTradeGuideArticle';
import { CARRY_TRADE_FAQS, CARRY_TRADE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate currency carry trade profit, spot rate differentials, investment returns, and borrowing costs with a free online calculator.',
  asideAriaLabel: 'Interactive Carry Trade Calculator',
  tocItems: CARRY_TRADE_TOC_ITEMS,
  GuideArticle: CarryTradeGuideArticle,
  faqs: CARRY_TRADE_FAQS,
  countryRules: null,
};
