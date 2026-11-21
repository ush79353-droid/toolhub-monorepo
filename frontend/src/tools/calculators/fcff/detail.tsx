import type { ToolPageDetail } from '@/tools/page-detail';
import { FcffGuideArticle } from './FcffGuideArticle';
import { FCFF_FAQS, FCFF_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate free cash flow to firm from net income, EBITDA, EBIT, or CFO with tax, CapEx, and working-capital adjustments; independent FX on every money field.',
  asideAriaLabel: 'Interactive FCFF Calculator',
  tocItems: FCFF_TOC_ITEMS,
  GuideArticle: FcffGuideArticle,
  faqs: FCFF_FAQS,
  countryRules: null,
};
