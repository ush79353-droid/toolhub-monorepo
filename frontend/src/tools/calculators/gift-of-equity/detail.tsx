import type { ToolPageDetail } from '@/tools/page-detail';
import { GiftOfEquityGuideArticle } from './GiftOfEquityGuideArticle';
import { GIFT_OF_EQUITY_FAQS, GIFT_OF_EQUITY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate gift of equity as market value minus sales price, or reverse-solve sales price or market value, with clear one-way calculation modes and denomination-only currency display.',
  asideAriaLabel: 'Interactive Gift of Equity Calculator',
  tocItems: GIFT_OF_EQUITY_TOC_ITEMS,
  GuideArticle: GiftOfEquityGuideArticle,
  faqs: GIFT_OF_EQUITY_FAQS,
  countryRules: null,
};
