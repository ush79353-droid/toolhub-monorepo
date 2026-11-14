import type { ToolPageDetail } from '@/tools/page-detail';
import { BitcoinEtfGuideArticle } from './BitcoinEtfGuideArticle';
import { BITCOIN_ETF_FAQS, BITCOIN_ETF_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead: 'Estimate Bitcoin ETF growth after expense ratio and costs.',
  asideAriaLabel: 'Interactive Bitcoin ETF Calculator',
  tocItems: BITCOIN_ETF_TOC_ITEMS,
  GuideArticle: BitcoinEtfGuideArticle,
  faqs: BITCOIN_ETF_FAQS,
  countryRules: null,
};
