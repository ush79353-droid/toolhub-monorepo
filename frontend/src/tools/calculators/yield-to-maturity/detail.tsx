import type { ToolPageDetail } from '@/tools/page-detail';
import { YieldToMaturityGuideArticle } from './YieldToMaturityGuideArticle';
import {
  YIELD_TO_MATURITY_FAQS,
  YIELD_TO_MATURITY_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    "Calculate a bond's yield to maturity using its market price, face value, annual coupon rate, coupon frequency, and remaining term.",
  asideAriaLabel: 'Interactive Yield to Maturity Calculator',
  tocItems: YIELD_TO_MATURITY_TOC_ITEMS,
  GuideArticle: YieldToMaturityGuideArticle,
  faqs: YIELD_TO_MATURITY_FAQS,
  countryRules: null,
};
