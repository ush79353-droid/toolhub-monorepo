import type { ToolPageDetail } from '@/tools/page-detail';
import { UnleveredFreeCashFlowGuideArticle } from './UnleveredFreeCashFlowGuideArticle';
import { UNLEVERED_FCF_FAQS, UNLEVERED_FCF_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate unlevered free cash flow from EBIT, effective tax rate, depreciation and amortization, CapEx, and change in working capital, with independent FX on each money field and no interest or debt-repayment deductions.',
  asideAriaLabel: 'Interactive Unlevered Free Cash Flow Calculator',
  tocItems: UNLEVERED_FCF_TOC_ITEMS,
  GuideArticle: UnleveredFreeCashFlowGuideArticle,
  faqs: UNLEVERED_FCF_FAQS,
  countryRules: null,
};
