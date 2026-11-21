import type { ToolPageDetail } from '@/tools/page-detail';
import { BalanceTransferGuideArticle } from './BalanceTransferGuideArticle';
import {
  BALANCE_TRANSFER_FAQS,
  BALANCE_TRANSFER_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare keeping a credit card balance with transferring it to a promotional offer, fees, intro APR, post-promo APR, monthly payments, and estimated savings.',
  asideAriaLabel: 'Interactive Balance Transfer Calculator',
  tocItems: BALANCE_TRANSFER_TOC_ITEMS,
  GuideArticle: BalanceTransferGuideArticle,
  faqs: BALANCE_TRANSFER_FAQS,
  countryRules: null,
};
