import type { ToolPageDetail } from '@/tools/page-detail';
import { RealRateOfReturnGuideArticle } from './RealRateOfReturnGuideArticle';
import { REAL_RATE_OF_RETURN_FAQS, REAL_RATE_OF_RETURN_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert a nominal return into an inflation-adjusted real return with the Fisher equation.',
  asideAriaLabel: 'Interactive Real Rate of Return Calculator',
  tocItems: REAL_RATE_OF_RETURN_TOC_ITEMS,
  GuideArticle: RealRateOfReturnGuideArticle,
  faqs: REAL_RATE_OF_RETURN_FAQS,
  countryRules: null,
};
