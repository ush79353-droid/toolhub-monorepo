import type { ToolPageDetail } from '@/tools/page-detail';
import { DividendPayoutRatioGuideArticle } from './DividendPayoutRatioGuideArticle';
import {
  DIVIDEND_PAYOUT_RATIO_FAQS,
  DIVIDEND_PAYOUT_RATIO_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Find company and per-share dividend payout ratios from total dividends, net income, DPS, and diluted EPS — with independent FX on each money field.',
  asideAriaLabel: 'Interactive Dividend Payout Ratio Calculator',
  tocItems: DIVIDEND_PAYOUT_RATIO_TOC_ITEMS,
  GuideArticle: DividendPayoutRatioGuideArticle,
  faqs: DIVIDEND_PAYOUT_RATIO_FAQS,
  countryRules: null,
};
