import type { ToolPageDetail } from '@/tools/page-detail';
import { MarginCallGuideArticle } from './MarginCallGuideArticle';
import { MARGIN_CALL_FAQS, MARGIN_CALL_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate futures point value, long/short P/L, account equity, and margin-call status with real multi-currency conversion.',
  asideAriaLabel: 'Interactive Margin Call Calculator',
  tocItems: MARGIN_CALL_TOC_ITEMS,
  GuideArticle: MarginCallGuideArticle,
  faqs: MARGIN_CALL_FAQS,
  countryRules: null,
};
