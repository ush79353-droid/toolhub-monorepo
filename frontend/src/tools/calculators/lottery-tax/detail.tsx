import type { ToolPageDetail } from '@/tools/page-detail';
import { LotteryTaxGuideArticle } from './LotteryTaxGuideArticle';
import { LOTTERY_TAX_FAQS, LOTTERY_TAX_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare lottery lump-sum vs growing annuity payouts with custom or US withholding tax estimates and Phase 2 FX.',
  asideAriaLabel: 'Interactive Lottery Tax Calculator',
  tocItems: LOTTERY_TAX_TOC_ITEMS,
  GuideArticle: LotteryTaxGuideArticle,
  faqs: LOTTERY_TAX_FAQS,
  countryRules: null,
};
