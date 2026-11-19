import type { ToolPageDetail } from '@/tools/page-detail';
import {
  CAR_AFFORDABILITY_FAQS,
  CAR_AFFORDABILITY_TOC_ITEMS,
} from './content';
import { CarAffordabilityGuideArticle } from './CarAffordabilityGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate how much car you can afford from your monthly payment budget, available cash, trade-in value, interest rate, and loan term — with optional tax and fees. Currency changes formatting only.',
  asideAriaLabel: 'Car Affordability Calculator guide',
  tocItems: CAR_AFFORDABILITY_TOC_ITEMS,
  GuideArticle: CarAffordabilityGuideArticle,
  faqs: CAR_AFFORDABILITY_FAQS,
  countryRules: null,
};
