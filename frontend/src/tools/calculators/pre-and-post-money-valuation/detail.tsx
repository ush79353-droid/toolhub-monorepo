import type { ToolPageDetail } from '@/tools/page-detail';
import { PreAndPostMoneyValuationGuideArticle } from './PreAndPostMoneyValuationGuideArticle';
import { PPM_FAQS, PPM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Solve investment, investor equity, and pre- or post-money valuation from any two related inputs; blanks fill without overwriting your numbers.',
  asideAriaLabel: 'Interactive pre and post money valuation calculator',
  tocItems: PPM_TOC_ITEMS,
  GuideArticle: PreAndPostMoneyValuationGuideArticle,
  faqs: PPM_FAQS,
  countryRules: null,
};
