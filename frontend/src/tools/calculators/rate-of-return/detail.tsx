import type { ToolPageDetail } from '@/tools/page-detail';
import { RateOfReturnGuideArticle } from './RateOfReturnGuideArticle';
import { RATE_OF_RETURN_FAQS, RATE_OF_RETURN_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Find the annual nominal rate of return from an initial investment, final amount, duration, compounding, and optional cash flows.',
  asideAriaLabel: 'Interactive Rate of Return Calculator',
  tocItems: RATE_OF_RETURN_TOC_ITEMS,
  GuideArticle: RateOfReturnGuideArticle,
  faqs: RATE_OF_RETURN_FAQS,
  countryRules: null,
};
