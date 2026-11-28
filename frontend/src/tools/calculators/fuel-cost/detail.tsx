import type { ToolPageDetail } from '@/tools/page-detail';
import { FuelCostGuideArticle } from './FuelCostGuideArticle';
import { FUEL_COST_FAQS, FUEL_COST_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate fuel used and trip expenses from distance, fuel economy, and pump price — with round-trip toggle, unit conversions, and denomination-only currency labeling.',
  asideAriaLabel: 'Interactive Fuel Cost Calculator',
  tocItems: FUEL_COST_TOC_ITEMS,
  GuideArticle: FuelCostGuideArticle,
  faqs: FUEL_COST_FAQS,
  countryRules: null,
};
