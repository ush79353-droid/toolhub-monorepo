import type { ToolPageDetail } from '@/tools/page-detail';
import { TakeHomePayUkGuideArticle } from './TakeHomePayUkGuideArticle';
import { THUK_FAQS, THUK_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate UK take-home pay from employment, self-employment, and rental income with location-specific Income Tax and National Insurance. Fixed GBP.',
  asideAriaLabel: 'Interactive Take Home Pay Calculator UK',
  tocItems: THUK_TOC_ITEMS,
  GuideArticle: TakeHomePayUkGuideArticle,
  faqs: THUK_FAQS,
  countryRules: null,
};
