import type { ToolPageDetail } from '@/tools/page-detail';
import { FreeCashFlowGuideArticle } from './FreeCashFlowGuideArticle';
import { FREE_CASH_FLOW_FAQS, FREE_CASH_FLOW_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate free cash flow from operating cash flow and CapEx, plus per-share FCF, FCF yield, and FCF margin, with independent currency conversion on every money field.',
  asideAriaLabel: 'Interactive Free Cash Flow Calculator',
  tocItems: FREE_CASH_FLOW_TOC_ITEMS,
  GuideArticle: FreeCashFlowGuideArticle,
  faqs: FREE_CASH_FLOW_FAQS,
  countryRules: null,
};
