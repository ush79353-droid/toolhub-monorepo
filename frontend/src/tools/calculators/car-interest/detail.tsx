import type { ToolPageDetail } from '@/tools/page-detail';
import { CarInterestGuideArticle } from './CarInterestGuideArticle';
import { CAR_INTEREST_FAQS, CAR_INTEREST_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate car-loan principal, monthly payment, and total interest from price, down payment, trade-in, rate, and term.',
  asideAriaLabel: 'Interactive Car Interest Calculator',
  tocItems: CAR_INTEREST_TOC_ITEMS,
  GuideArticle: CarInterestGuideArticle,
  faqs: CAR_INTEREST_FAQS,
  countryRules: null,
};
