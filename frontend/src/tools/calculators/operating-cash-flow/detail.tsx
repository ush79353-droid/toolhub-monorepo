import type { ToolPageDetail } from '@/tools/page-detail';
import { OperatingCashFlowGuideArticle } from './OperatingCashFlowGuideArticle';
import { OCF_FAQS, OCF_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compute operating cash flow from net income using the indirect method, with depreciation, amortization, working-capital balance-change adjustments, other operating cash flows, and independent FX on every money field.',
  asideAriaLabel: 'Interactive Operating Cash Flow Calculator',
  tocItems: OCF_TOC_ITEMS,
  GuideArticle: OperatingCashFlowGuideArticle,
  faqs: OCF_FAQS,
  countryRules: null,
};
