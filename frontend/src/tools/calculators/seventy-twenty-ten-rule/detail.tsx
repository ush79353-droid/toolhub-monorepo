import type { ToolPageDetail } from '@/tools/page-detail';
import { SEVENTY_TWENTY_TEN_FAQS, SEVENTY_TWENTY_TEN_TOC } from './content';
import { SeventyTwentyTenGuideArticle } from './SeventyTwentyTenGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Split after-tax income into needs, savings and debt, and lifestyle, then compare what you actually spent. Monthly and annual views use the same money.',
  asideAriaLabel: 'Interactive 70/20/10 rule money calculator',
  tocItems: SEVENTY_TWENTY_TEN_TOC,
  GuideArticle: SeventyTwentyTenGuideArticle,
  faqs: SEVENTY_TWENTY_TEN_FAQS,
  countryRules: null,
};
