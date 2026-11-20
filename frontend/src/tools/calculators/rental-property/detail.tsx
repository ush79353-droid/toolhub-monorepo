import type { ToolPageDetail } from '@/tools/page-detail';
import { RentalPropertyGuideArticle } from './RentalPropertyGuideArticle';
import { RENTAL_PROPERTY_FAQS, RENTAL_PROPERTY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate rental property financing, vacancy-adjusted income, operating expenses, NOI, mortgage payments, cash flow, cash-on-cash return, cap rate, appreciation, and holding-period investment ROI — with a simplified pre-tax model.',
  asideAriaLabel: 'Interactive Rental Property Calculator',
  tocItems: RENTAL_PROPERTY_TOC_ITEMS,
  GuideArticle: RentalPropertyGuideArticle,
  faqs: RENTAL_PROPERTY_FAQS,
  countryRules: null,
};
