import type { ToolPageDetail } from '@/tools/page-detail';
import { HomeLoanEmiGuideArticle } from './HomeLoanEmiGuideArticle';
import { HOME_LOAN_EMI_FAQS, HOME_LOAN_EMI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate home loan EMI, total amount payable, and total interest with a principal-vs-interest chart.',
  asideAriaLabel: 'Interactive Home Loan EMI Calculator',
  tocItems: HOME_LOAN_EMI_TOC_ITEMS,
  GuideArticle: HomeLoanEmiGuideArticle,
  faqs: HOME_LOAN_EMI_FAQS,
  countryRules: null,
};
