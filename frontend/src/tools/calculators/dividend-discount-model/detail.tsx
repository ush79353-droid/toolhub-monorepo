import type { ToolPageDetail } from '@/tools/page-detail';
import { DividendDiscountModelGuideArticle } from './DividendDiscountModelGuideArticle';
import { DDM_FAQS, DDM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate constant-growth stock value from payout, ROE, dividend, and CAPM cost of equity.',
  asideAriaLabel: 'Interactive Dividend Discount Model Calculator',
  tocItems: DDM_TOC_ITEMS,
  GuideArticle: DividendDiscountModelGuideArticle,
  faqs: DDM_FAQS,
  countryRules: null,
};
