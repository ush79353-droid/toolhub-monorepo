import type { ToolPageDetail } from '@/tools/page-detail';
import { CurrentRatioGuideArticle } from './CurrentRatioGuideArticle';
import { CR_FAQS, CR_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Measure short-term liquidity coverage from current assets and current liabilities: CR = CA / CL; with working capital and optional reverse modes. No universal good/bad threshold.',
  asideAriaLabel: 'Interactive Current Ratio Calculator',
  tocItems: CR_TOC_ITEMS,
  GuideArticle: CurrentRatioGuideArticle,
  faqs: CR_FAQS,
  countryRules: null,
};
