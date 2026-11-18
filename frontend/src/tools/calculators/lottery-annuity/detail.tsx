import type { ToolPageDetail } from '@/tools/page-detail';
import { LotteryAnnuityGuideArticle } from './LotteryAnnuityGuideArticle';
import { LOTTERY_ANNUITY_FAQS, LOTTERY_ANNUITY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Project growing lottery annuity payouts from prize, term, growth, and rate of return, with real currency conversion on the prize amount.',
  asideAriaLabel: 'Interactive Lottery Annuity Calculator',
  tocItems: LOTTERY_ANNUITY_TOC_ITEMS,
  GuideArticle: LotteryAnnuityGuideArticle,
  faqs: LOTTERY_ANNUITY_FAQS,
  countryRules: null,
};
