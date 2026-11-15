import type { ToolPageDetail } from '@/tools/page-detail';
import { MoneyMarketAccountGuideArticle } from './MoneyMarketAccountGuideArticle';
import { MONEY_MARKET_FAQS, MONEY_MARKET_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate money market growth from a starting balance, optional recurring deposits, expected return, and investment period.',
  asideAriaLabel: 'Interactive Money Market Account Calculator',
  tocItems: MONEY_MARKET_TOC_ITEMS,
  GuideArticle: MoneyMarketAccountGuideArticle,
  faqs: MONEY_MARKET_FAQS,
  countryRules: null,
};
