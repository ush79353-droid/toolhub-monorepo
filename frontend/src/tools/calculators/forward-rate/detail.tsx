import type { ToolPageDetail } from '@/tools/page-detail';
import { ForwardRateGuideArticle } from './ForwardRateGuideArticle';
import { FORWARD_RATE_FAQS, FORWARD_RATE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Use our Forward Rate Calculator to find the annually compounded implied forward rate between two spot rates. Enter times n₁ and n₂ with spots S₁ and S₂, then read the break-even reinvestment rate for the interval between them.',
  asideAriaLabel: 'Interactive Forward Rate Calculator',
  tocItems: FORWARD_RATE_TOC_ITEMS,
  GuideArticle: ForwardRateGuideArticle,
  faqs: FORWARD_RATE_FAQS,
  countryRules: null,
};
