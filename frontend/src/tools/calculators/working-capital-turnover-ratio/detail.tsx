import type { ToolPageDetail } from '@/tools/page-detail';
import { WorkingCapitalTurnoverRatioGuideArticle } from './WorkingCapitalTurnoverRatioGuideArticle';
import {
  WORKING_CAPITAL_TURNOVER_RATIO_FAQS,
  WORKING_CAPITAL_TURNOVER_RATIO_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate working capital turnover — Revenue ÷ (Average current assets − Average current liabilities) — from opening and closing balances.',
  asideAriaLabel: 'Interactive Working Capital Turnover Ratio Calculator',
  tocItems: WORKING_CAPITAL_TURNOVER_RATIO_TOC_ITEMS,
  GuideArticle: WorkingCapitalTurnoverRatioGuideArticle,
  faqs: WORKING_CAPITAL_TURNOVER_RATIO_FAQS,
  countryRules: null,
};
