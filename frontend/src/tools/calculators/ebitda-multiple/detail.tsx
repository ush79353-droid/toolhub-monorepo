import type { ToolPageDetail } from '@/tools/page-detail';
import { EbitdaMultipleGuideArticle } from './EbitdaMultipleGuideArticle';
import { EBITDA_MULTIPLE_FAQS, EBITDA_MULTIPLE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate enterprise value and the EV/EBITDA valuation multiple from market capitalization, debt, cash, and related components.',
  asideAriaLabel: 'Interactive EBITDA Multiple Calculator',
  tocItems: EBITDA_MULTIPLE_TOC_ITEMS,
  GuideArticle: EbitdaMultipleGuideArticle,
  faqs: EBITDA_MULTIPLE_FAQS,
  countryRules: null,
};
