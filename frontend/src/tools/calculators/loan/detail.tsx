import type { ToolPageDetail } from '@/tools/page-detail';
import { SIDEBAR_COUNTRIES } from '@/tools/shared/sidebar-countries';
import { LOAN_FAQS, LOAN_TOC_ITEMS } from './content';
import { LoanGuideArticle } from './LoanGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate regular payments, total interest, extra-payment savings, origination fees, and amortization schedules for amortized or interest-only loans directly in your browser.',
  asideAriaLabel: 'Interactive loan calculator',
  tocItems: LOAN_TOC_ITEMS,
  GuideArticle: LoanGuideArticle,
  faqs: LOAN_FAQS,
  countryRules: {
    title: 'Loan rules by country',
    countries: SIDEBAR_COUNTRIES,
  },
};
