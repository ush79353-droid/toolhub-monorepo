import type { ToolPageDetail } from '@/tools/page-detail';
import { RetainedEarningsGuideArticle } from './RetainedEarningsGuideArticle';
import {
  RETAINED_EARNINGS_FAQS,
  RETAINED_EARNINGS_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate current-period retained earnings from net income and the dividend payout ratio, plus retained earnings per share.',
  asideAriaLabel: 'Interactive Retained Earnings Calculator',
  tocItems: RETAINED_EARNINGS_TOC_ITEMS,
  GuideArticle: RetainedEarningsGuideArticle,
  faqs: RETAINED_EARNINGS_FAQS,
  countryRules: null,
};
