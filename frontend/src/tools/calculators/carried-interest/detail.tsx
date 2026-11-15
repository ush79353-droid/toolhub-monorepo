import type { ToolPageDetail } from '@/tools/page-detail';
import { CarriedInterestGuideArticle } from './CarriedInterestGuideArticle';
import { CARRIED_INTEREST_FAQS, CARRIED_INTEREST_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate GP carried interest from fund values, hold period, hurdle, and catch-up.',
  asideAriaLabel: 'Interactive Carried Interest Calculator',
  tocItems: CARRIED_INTEREST_TOC_ITEMS,
  GuideArticle: CarriedInterestGuideArticle,
  faqs: CARRIED_INTEREST_FAQS,
  countryRules: null,
};
