import type { ToolPageDetail } from '@/tools/page-detail';
import { AnnuityPayoutGuideArticle } from './AnnuityPayoutGuideArticle';
import { ANNUITY_PAYOUT_FAQS, ANNUITY_PAYOUT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Find sustainable annuity withdrawals for a fixed term, or how long a fixed payment lasts, with ordinary or due timing and real FX on balances.',
  asideAriaLabel: 'Interactive Annuity Payout Calculator',
  tocItems: ANNUITY_PAYOUT_TOC_ITEMS,
  GuideArticle: AnnuityPayoutGuideArticle,
  faqs: ANNUITY_PAYOUT_FAQS,
  countryRules: null,
};
