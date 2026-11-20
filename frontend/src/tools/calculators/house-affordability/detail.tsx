import type { ToolPageDetail } from '@/tools/page-detail';
import { HouseAffordabilityGuideArticle } from './HouseAffordabilityGuideArticle';
import {
  HOUSE_AFFORDABILITY_FAQS,
  HOUSE_AFFORDABILITY_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Two independent estimators on one page: income-based DTI affordability (conventional, FHA-style, VA-style, or custom) and fixed monthly housing budgets with optional taxes, fees, and maintenance.',
  asideAriaLabel: 'Interactive House Affordability Calculator',
  tocItems: HOUSE_AFFORDABILITY_TOC_ITEMS,
  GuideArticle: HouseAffordabilityGuideArticle,
  faqs: HOUSE_AFFORDABILITY_FAQS,
  countryRules: null,
};
