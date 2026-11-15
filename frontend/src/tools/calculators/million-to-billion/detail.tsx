import type { ToolPageDetail } from '@/tools/page-detail';
import { MillionToBillionGuideArticle } from './MillionToBillionGuideArticle';
import { MILLION_BILLION_FAQS, MILLION_BILLION_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert millions to billions and billions back to millions with a synced full-number field.',
  asideAriaLabel: 'Interactive million to billion converter',
  tocItems: MILLION_BILLION_TOC_ITEMS,
  GuideArticle: MillionToBillionGuideArticle,
  faqs: MILLION_BILLION_FAQS,
  countryRules: null,
};
