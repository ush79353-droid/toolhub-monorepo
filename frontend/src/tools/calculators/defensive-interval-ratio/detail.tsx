import type { ToolPageDetail } from '@/tools/page-detail';
import { DefensiveIntervalRatioGuideArticle } from './DefensiveIntervalRatioGuideArticle';
import {
  DEFENSIVE_INTERVAL_RATIO_FAQS,
  DEFENSIVE_INTERVAL_RATIO_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    "Calculate how many days a company can continue covering its average daily cash operating expenditures using available defensive assets — cash, marketable securities, and collectible receivables — without relying on additional operating cash inflows or external financing.",
  asideAriaLabel: 'Interactive Defensive Interval Ratio Calculator',
  tocItems: DEFENSIVE_INTERVAL_RATIO_TOC_ITEMS,
  GuideArticle: DefensiveIntervalRatioGuideArticle,
  faqs: DEFENSIVE_INTERVAL_RATIO_FAQS,
  countryRules: null,
};
