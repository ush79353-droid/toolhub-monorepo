import type { ToolPageDetail } from '@/tools/page-detail';
import { AnnualizedRateOfReturnGuideArticle } from './AnnualizedRateOfReturnGuideArticle';
import {
  ANNUALIZED_RATE_OF_RETURN_FAQS,
  ANNUALIZED_RATE_OF_RETURN_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead: 'Convert a period return into an annualized compounded rate.',
  asideAriaLabel: 'Interactive Annualized Rate of Return Calculator',
  tocItems: ANNUALIZED_RATE_OF_RETURN_TOC_ITEMS,
  GuideArticle: AnnualizedRateOfReturnGuideArticle,
  faqs: ANNUALIZED_RATE_OF_RETURN_FAQS,
  countryRules: null,
};
