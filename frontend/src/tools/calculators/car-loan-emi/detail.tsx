import type { ToolPageDetail } from '@/tools/page-detail';
import { CarLoanEmiGuideArticle } from './CarLoanEmiGuideArticle';
import { CAR_LOAN_EMI_FAQS, CAR_LOAN_EMI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate car loan EMI after cash, trade-in, and sales tax with real FX conversion on every money field.',
  asideAriaLabel: 'Interactive Car Loan EMI Calculator',
  tocItems: CAR_LOAN_EMI_TOC_ITEMS,
  GuideArticle: CarLoanEmiGuideArticle,
  faqs: CAR_LOAN_EMI_FAQS,
  countryRules: null,
};
