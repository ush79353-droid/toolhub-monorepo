import type { ToolPageDetail } from '@/tools/page-detail';
import { AnnualizedReturnGuideArticle } from './AnnualizedReturnGuideArticle';
import { ANNUALIZED_RETURN_FAQS, ANNUALIZED_RETURN_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate annualized return from a total return percentage or from beginning and ending values over a holding period.',
  asideAriaLabel: 'Interactive annualized return calculator',
  tocItems: ANNUALIZED_RETURN_TOC_ITEMS,
  GuideArticle: AnnualizedReturnGuideArticle,
  faqs: ANNUALIZED_RETURN_FAQS,
  countryRules: null,
};
