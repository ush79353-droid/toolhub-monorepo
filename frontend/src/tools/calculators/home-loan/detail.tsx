import type { ToolPageDetail } from '@/tools/page-detail';
import { HomeLoanGuideArticle } from './HomeLoanGuideArticle';
import { HOME_LOAN_FAQS, HOME_LOAN_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate home-loan payments, interest, PMI, payoff date, and a principal-versus-interest breakdown, with independent FX on money fields.',
  asideAriaLabel: 'Interactive Home Loan Calculator',
  tocItems: HOME_LOAN_TOC_ITEMS,
  GuideArticle: HomeLoanGuideArticle,
  faqs: HOME_LOAN_FAQS,
  countryRules: null,
};
