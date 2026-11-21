import type { ToolPageDetail } from '@/tools/page-detail';
import { FuturesContractsGuideArticle } from './FuturesContractsGuideArticle';
import { FUTURES_CONTRACTS_FAQS, FUTURES_CONTRACTS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate long or short futures profit and loss from tick value, ticks per point, buy/sell prices, and contract count with independent FX on money fields.',
  asideAriaLabel: 'Interactive Futures Contracts Calculator',
  tocItems: FUTURES_CONTRACTS_TOC_ITEMS,
  GuideArticle: FuturesContractsGuideArticle,
  faqs: FUTURES_CONTRACTS_FAQS,
  countryRules: null,
};
