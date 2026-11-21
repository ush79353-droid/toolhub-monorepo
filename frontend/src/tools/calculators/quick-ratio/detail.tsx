import type { ToolPageDetail } from '@/tools/page-detail';
import { QuickRatioGuideArticle } from './QuickRatioGuideArticle';
import { QUICK_RATIO_FAQS, QUICK_RATIO_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    "Calculate the quick ratio (acid-test ratio) from liquid assets and current liabilities to assess a company's short-term liquidity without relying on inventory sales.",
  asideAriaLabel: 'Interactive Quick Ratio Calculator',
  tocItems: QUICK_RATIO_TOC_ITEMS,
  GuideArticle: QuickRatioGuideArticle,
  faqs: QUICK_RATIO_FAQS,
  countryRules: null,
};
