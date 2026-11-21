import type { ToolPageDetail } from '@/tools/page-detail';
import { OptionsSpreadGuideArticle } from './OptionsSpreadGuideArticle';
import { OPTIONS_SPREAD_FAQS, OPTIONS_SPREAD_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate debit/credit, max loss and profit, breakeven, and target P/L for bull and bear call/put vertical spreads.',
  asideAriaLabel: 'Interactive Options Spread Calculator',
  tocItems: OPTIONS_SPREAD_TOC_ITEMS,
  GuideArticle: OptionsSpreadGuideArticle,
  faqs: OPTIONS_SPREAD_FAQS,
  countryRules: null,
};
