import type { ToolPageDetail } from '@/tools/page-detail';
import { SavingsWithdrawalGuideArticle } from './SavingsWithdrawalGuideArticle';
import {
  SAVINGS_WITHDRAWAL_FAQS,
  SAVINGS_WITHDRAWAL_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate how long savings last under monthly withdrawals with interest, independent FX on balance and withdrawal amount, and a clear withdrawal timeline.',
  asideAriaLabel: 'Interactive Savings Withdrawal Calculator',
  tocItems: SAVINGS_WITHDRAWAL_TOC_ITEMS,
  GuideArticle: SavingsWithdrawalGuideArticle,
  faqs: SAVINGS_WITHDRAWAL_FAQS,
  countryRules: null,
};
