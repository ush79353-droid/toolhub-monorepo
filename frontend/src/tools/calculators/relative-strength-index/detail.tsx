import type { ToolPageDetail } from '@/tools/page-detail';
import { RelativeStrengthIndexGuideArticle } from './RelativeStrengthIndexGuideArticle';
import { RSI_FAQS, RSI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate the Relative Strength Index (RSI) from sequential closing prices using Wilder’s smoothing or a simple-average method, with average gain/loss, RS, and momentum interpretation.',
  asideAriaLabel: 'Interactive Relative Strength Index Calculator',
  tocItems: RSI_TOC_ITEMS,
  GuideArticle: RelativeStrengthIndexGuideArticle,
  faqs: RSI_FAQS,
  countryRules: null,
};
