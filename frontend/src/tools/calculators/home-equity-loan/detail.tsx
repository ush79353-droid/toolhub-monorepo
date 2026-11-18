import type { ToolPageDetail } from '@/tools/page-detail';
import { HomeEquityLoanGuideArticle } from './HomeEquityLoanGuideArticle';
import { HOME_EQUITY_LOAN_FAQS, HOME_EQUITY_LOAN_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate home equity loan monthly payments, total repayment, and interest with a principal-versus-interest chart.',
  asideAriaLabel: 'Interactive Home Equity Loan Calculator',
  tocItems: HOME_EQUITY_LOAN_TOC_ITEMS,
  GuideArticle: HomeEquityLoanGuideArticle,
  faqs: HOME_EQUITY_LOAN_FAQS,
  countryRules: null,
};
