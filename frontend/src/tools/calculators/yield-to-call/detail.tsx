import type { ToolPageDetail } from '@/tools/page-detail';
import { YieldToCallGuideArticle } from './YieldToCallGuideArticle';
import { YIELD_TO_CALL_FAQS, YIELD_TO_CALL_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    "Calculate a bond's yield to call from annual interest, call price, market price, and years until call.",
  asideAriaLabel: 'Interactive Yield to Call Calculator',
  tocItems: YIELD_TO_CALL_TOC_ITEMS,
  GuideArticle: YieldToCallGuideArticle,
  faqs: YIELD_TO_CALL_FAQS,
  countryRules: null,
};
