import type { ToolPageDetail } from '@/tools/page-detail';
import { TimeAndAHalfGuideArticle } from './TimeAndAHalfGuideArticle';
import { TIME_AND_A_HALF_FAQS, TIME_AND_A_HALF_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate standard, time-and-a-half, double-time, and triple-time earnings from your hourly rate and hours in each category, with independent FX on every money field.',
  asideAriaLabel: 'Interactive Time and a Half Calculator',
  tocItems: TIME_AND_A_HALF_TOC_ITEMS,
  GuideArticle: TimeAndAHalfGuideArticle,
  faqs: TIME_AND_A_HALF_FAQS,
  countryRules: null,
};
