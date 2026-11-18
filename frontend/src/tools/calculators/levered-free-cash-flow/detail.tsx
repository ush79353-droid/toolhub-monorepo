import type { ToolPageDetail } from '@/tools/page-detail';
import { LeveredFreeCashFlowGuideArticle } from './LeveredFreeCashFlowGuideArticle';
import { LEVERED_FCF_FAQS, LEVERED_FCF_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate simplified levered free cash flow from EBITDA, CapEx, working-capital change, and mandatory debt repayments, with independent FX on each money field and a clear disclosure that this is not a full FCFE calculation.',
  asideAriaLabel: 'Interactive Levered Free Cash Flow Calculator',
  tocItems: LEVERED_FCF_TOC_ITEMS,
  GuideArticle: LeveredFreeCashFlowGuideArticle,
  faqs: LEVERED_FCF_FAQS,
  countryRules: null,
};
