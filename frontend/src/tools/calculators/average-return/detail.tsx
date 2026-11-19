import type { ToolPageDetail } from '@/tools/page-detail';
import { AVERAGE_RETURN_FAQS, AVERAGE_RETURN_TOC_ITEMS } from './content';
import { AverageReturnGuideArticle } from './AverageReturnGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate money-weighted average annual return from dated cash flows (XIRR), or compute arithmetic average annualized returns and cumulative compounding across investment periods. Currency changes formatting only.',
  asideAriaLabel: 'Average Return Calculator guide',
  tocItems: AVERAGE_RETURN_TOC_ITEMS,
  GuideArticle: AverageReturnGuideArticle,
  faqs: AVERAGE_RETURN_FAQS,
  countryRules: null,
};
