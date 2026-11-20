import type { ToolPageDetail } from '@/tools/page-detail';
import { MarketCapitalizationGuideArticle } from './MarketCapitalizationGuideArticle';
import { MCAP_FAQS, MCAP_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate equity market capitalization from share price and outstanding shares, with compact large-number display and worked examples.',
  asideAriaLabel: 'Interactive Market Capitalization Calculator',
  tocItems: MCAP_TOC_ITEMS,
  GuideArticle: MarketCapitalizationGuideArticle,
  faqs: MCAP_FAQS,
  countryRules: null,
};
