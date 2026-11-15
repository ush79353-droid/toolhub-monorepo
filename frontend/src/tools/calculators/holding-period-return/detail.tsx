import type { ToolPageDetail } from '@/tools/page-detail';
import { HoldingPeriodReturnGuideArticle } from './HoldingPeriodReturnGuideArticle';
import {
  HOLDING_PERIOD_RETURN_FAQS,
  HOLDING_PERIOD_RETURN_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate capital gains yield, dividend yield, and holding period return from bought price, current price, and dividends.',
  asideAriaLabel: 'Interactive Holding Period Return Calculator',
  tocItems: HOLDING_PERIOD_RETURN_TOC_ITEMS,
  GuideArticle: HoldingPeriodReturnGuideArticle,
  faqs: HOLDING_PERIOD_RETURN_FAQS,
  countryRules: null,
};
