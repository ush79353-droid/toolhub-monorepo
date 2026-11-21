import type { ToolPageDetail } from '@/tools/page-detail';
import { ReserveRatioGuideArticle } from './ReserveRatioGuideArticle';
import { RESERVE_RATIO_FAQS, RESERVE_RATIO_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    "Calculate a bank's reserve ratio, required reserves, excess reserves, and potentially loanable funds using its deposits and reserves. Explore how reserve requirements relate to fractional reserve banking and the simple money multiplier.",
  asideAriaLabel: 'Interactive Reserve Ratio Calculator',
  tocItems: RESERVE_RATIO_TOC_ITEMS,
  GuideArticle: ReserveRatioGuideArticle,
  faqs: RESERVE_RATIO_FAQS,
  countryRules: null,
};
