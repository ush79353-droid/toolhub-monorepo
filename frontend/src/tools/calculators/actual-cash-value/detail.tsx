import type { ToolPageDetail } from '@/tools/page-detail';
import { ActualCashValueGuideArticle } from './ActualCashValueGuideArticle';
import { ACV_FAQS, ACV_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate actual cash value with a simplified straight-line depreciation model from purchase price, expected useful life, and current age, including accumulated depreciation and remaining life. Not an insurance settlement.',
  asideAriaLabel: 'Interactive Actual Cash Value Calculator',
  tocItems: ACV_TOC_ITEMS,
  GuideArticle: ActualCashValueGuideArticle,
  faqs: ACV_FAQS,
  countryRules: null,
};
