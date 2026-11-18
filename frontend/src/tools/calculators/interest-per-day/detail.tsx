import type { ToolPageDetail } from '@/tools/page-detail';
import { InterestPerDayGuideArticle } from './InterestPerDayGuideArticle';
import { INTEREST_PER_DAY_FAQS, INTEREST_PER_DAY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate simple daily interest and the daily rate percent from a loan balance and annual rate, with independent FX on money fields.',
  asideAriaLabel: 'Interactive Interest Per Day Calculator',
  tocItems: INTEREST_PER_DAY_TOC_ITEMS,
  GuideArticle: InterestPerDayGuideArticle,
  faqs: INTEREST_PER_DAY_FAQS,
  countryRules: null,
};
