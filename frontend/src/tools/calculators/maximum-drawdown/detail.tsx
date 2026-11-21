import type { ToolPageDetail } from '@/tools/page-detail';
import {
  MAXIMUM_DRAWDOWN_FAQS,
  MAXIMUM_DRAWDOWN_TOC_ITEMS,
} from './content';
import { MaximumDrawdownGuideArticle } from './MaximumDrawdownGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Measure peak-to-trough investment drawdown, absolute loss, required recovery gain, and an optional constant-growth recovery time estimate. Currency changes formatting only.',
  asideAriaLabel: 'Maximum Drawdown Calculator guide',
  tocItems: MAXIMUM_DRAWDOWN_TOC_ITEMS,
  GuideArticle: MaximumDrawdownGuideArticle,
  faqs: MAXIMUM_DRAWDOWN_FAQS,
  countryRules: null,
};
