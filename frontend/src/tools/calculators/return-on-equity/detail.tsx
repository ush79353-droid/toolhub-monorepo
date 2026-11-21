import type { ToolPageDetail } from '@/tools/page-detail';
import { ReturnOnEquityGuideArticle } from './ReturnOnEquityGuideArticle';
import { ROE_FAQS, ROE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    "Calculate Return on Equity (ROE) from net profit and shareholders' equity (with optional average equity) to measure profitability relative to the equity base.",
  asideAriaLabel: 'Interactive Return on Equity Calculator',
  tocItems: ROE_TOC_ITEMS,
  GuideArticle: ReturnOnEquityGuideArticle,
  faqs: ROE_FAQS,
  countryRules: null,
};
