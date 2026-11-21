import type { ToolPageDetail } from '@/tools/page-detail';
import { FinanceChargeGuideArticle } from './FinanceChargeGuideArticle';
import { FINANCE_CHARGE_FAQS, FINANCE_CHARGE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate credit-card-style finance charges from balance, APR, and billing-cycle or given-term length using simple interest on a 365-day year.',
  asideAriaLabel: 'Interactive Finance Charge Calculator',
  tocItems: FINANCE_CHARGE_TOC_ITEMS,
  GuideArticle: FinanceChargeGuideArticle,
  faqs: FINANCE_CHARGE_FAQS,
  countryRules: null,
};
