import type { ToolPageDetail } from '@/tools/page-detail';
import { EarningsPerShareGuideArticle } from './EarningsPerShareGuideArticle';
import { EPS_FAQS, EPS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate basic earnings per share from net income, preferred dividends, and weighted-average common shares outstanding.',
  asideAriaLabel: 'Interactive Earnings per Share Calculator',
  tocItems: EPS_TOC_ITEMS,
  GuideArticle: EarningsPerShareGuideArticle,
  faqs: EPS_FAQS,
  countryRules: null,
};
