import type { ToolPageDetail } from '@/tools/page-detail';
import { DividendYieldGuideArticle } from './DividendYieldGuideArticle';
import { DIVIDEND_YIELD_FAQS, DIVIDEND_YIELD_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate annual dividends from per-period payments and dividend yield from share price, with independent FX on each money field.',
  asideAriaLabel: 'Interactive Dividend Yield Calculator',
  tocItems: DIVIDEND_YIELD_TOC_ITEMS,
  GuideArticle: DividendYieldGuideArticle,
  faqs: DIVIDEND_YIELD_FAQS,
  countryRules: null,
};
