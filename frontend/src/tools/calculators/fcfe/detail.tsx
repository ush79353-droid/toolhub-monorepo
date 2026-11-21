import type { ToolPageDetail } from '@/tools/page-detail';
import { FcfeGuideArticle } from './FcfeGuideArticle';
import { FCFE_FAQS, FCFE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate free cash flow to equity from net income, EBIT, EBITDA, CFO, or FCFF, with net borrowing, CapEx, and working-capital adjustments.',
  asideAriaLabel: 'Interactive FCFE Calculator',
  tocItems: FCFE_TOC_ITEMS,
  GuideArticle: FcfeGuideArticle,
  faqs: FCFE_FAQS,
  countryRules: null,
};
