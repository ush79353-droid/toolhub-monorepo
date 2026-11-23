import type { ToolPageDetail } from '@/tools/page-detail';
import { SIDEBAR_COUNTRIES } from '@/tools/shared/sidebar-countries';
import { AutoLoanGuideArticle } from './AutoLoanGuideArticle';
import { AUTO_LOAN_FAQS, AUTO_LOAN_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate monthly car payments, net trade-in equity, sales tax, fees, total interest, and payoff date directly in your browser.',
  asideAriaLabel: 'Interactive auto loan calculator',
  tocItems: AUTO_LOAN_TOC_ITEMS,
  GuideArticle: AutoLoanGuideArticle,
  faqs: AUTO_LOAN_FAQS,
  countryRules: {
    title: 'Auto loan rules by country',
    countries: SIDEBAR_COUNTRIES,
  },
};
