import type { ToolPageDetail } from '@/tools/page-detail';
import {
  BANK_RECONCILIATION_FAQS,
  BANK_RECONCILIATION_TOC_ITEMS,
} from './content';
import { BankReconciliationGuideArticle } from './BankReconciliationGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Reconcile cashbook and bank statement balances with independent adjustments for charges, NSF checks, interest, deposits in transit, outstanding checks, and custom add/subtract items. Currency changes formatting only.',
  asideAriaLabel: 'Bank Reconciliation Calculator guide',
  tocItems: BANK_RECONCILIATION_TOC_ITEMS,
  GuideArticle: BankReconciliationGuideArticle,
  faqs: BANK_RECONCILIATION_FAQS,
  countryRules: null,
};
