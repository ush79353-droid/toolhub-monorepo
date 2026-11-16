import type { ToolPageDetail } from '@/tools/page-detail';
import { MortgageAmortizationGuideArticle } from './MortgageAmortizationGuideArticle';
import {
  MORTGAGE_AMORTIZATION_FAQS,
  MORTGAGE_AMORTIZATION_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate monthly mortgage payments, optional housing costs, total interest, and payoff date with a payment breakdown chart.',
  asideAriaLabel: 'Interactive Mortgage Amortization Calculator',
  tocItems: MORTGAGE_AMORTIZATION_TOC_ITEMS,
  GuideArticle: MortgageAmortizationGuideArticle,
  faqs: MORTGAGE_AMORTIZATION_FAQS,
  countryRules: null,
};
