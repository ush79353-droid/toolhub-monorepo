import type { ToolPageDetail } from '@/tools/page-detail';
import { CagrGuideArticle } from './CagrGuideArticle';
import { CAGR_FAQS, CAGR_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate compound annual growth rate from initial value, final value, and periods, or solve any one missing field.',
  asideAriaLabel: 'Interactive CAGR calculator',
  tocItems: CAGR_TOC_ITEMS,
  GuideArticle: CagrGuideArticle,
  faqs: CAGR_FAQS,
  countryRules: null,
};
