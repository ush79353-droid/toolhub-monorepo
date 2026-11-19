import type { ToolPageDetail } from '@/tools/page-detail';
import {
  MEGA_MILLIONS_PAYOUT_FAQS,
  MEGA_MILLIONS_PAYOUT_TOC_ITEMS,
} from './content';
import { MegaMillionsPayoutGuideArticle } from './MegaMillionsPayoutGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare Mega Millions lump-sum and graduated annuity payouts with estimated federal and state taxes. Estimates only—not official lottery results.',
  asideAriaLabel: 'Mega Millions Payout Calculator guide',
  tocItems: MEGA_MILLIONS_PAYOUT_TOC_ITEMS,
  GuideArticle: MegaMillionsPayoutGuideArticle,
  faqs: MEGA_MILLIONS_PAYOUT_FAQS,
  countryRules: null,
};
