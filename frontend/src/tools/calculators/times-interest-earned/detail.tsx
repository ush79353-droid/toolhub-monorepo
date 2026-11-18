import type { ToolPageDetail } from '@/tools/page-detail';
import { TimesInterestEarnedGuideArticle } from './TimesInterestEarnedGuideArticle';
import {
  TIMES_INTEREST_EARNED_FAQS,
  TIMES_INTEREST_EARNED_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compute times interest earned as EBIT divided by total interest, with real currency conversion when the two amounts use different currencies.',
  asideAriaLabel: 'Interactive Times Interest Earned Ratio Calculator',
  tocItems: TIMES_INTEREST_EARNED_TOC_ITEMS,
  GuideArticle: TimesInterestEarnedGuideArticle,
  faqs: TIMES_INTEREST_EARNED_FAQS,
  countryRules: null,
};
