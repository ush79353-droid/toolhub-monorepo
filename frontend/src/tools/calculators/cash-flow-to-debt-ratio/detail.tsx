import type { ToolPageDetail } from '@/tools/page-detail';
import { CashFlowToDebtRatioGuideArticle } from './CashFlowToDebtRatioGuideArticle';
import {
  CASH_FLOW_TO_DEBT_RATIO_FAQS,
  CASH_FLOW_TO_DEBT_RATIO_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Measure operating cash flow coverage of total debt as a percent, with an optional debt-to-cash-flow multiple and short-/long-term debt components (real FX).',
  asideAriaLabel: 'Interactive Cash Flow to Debt Ratio Calculator',
  tocItems: CASH_FLOW_TO_DEBT_RATIO_TOC_ITEMS,
  GuideArticle: CashFlowToDebtRatioGuideArticle,
  faqs: CASH_FLOW_TO_DEBT_RATIO_FAQS,
  countryRules: null,
};
