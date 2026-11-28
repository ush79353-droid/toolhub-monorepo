import type { ToolPageDetail } from '@/tools/page-detail';
import { FuelPumpGuideArticle } from './FuelPumpGuideArticle';
import { FUEL_PUMP_FAQS, FUEL_PUMP_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate fuel pump flow demand from horsepower and BSFC, convert with fuel density, and compute rail/outlet pressure from return or returnless pressure-control modes — with optional capacity margin and manufacturer curve checks.',
  asideAriaLabel: 'Interactive Fuel Pump Calculator',
  tocItems: FUEL_PUMP_TOC_ITEMS,
  GuideArticle: FuelPumpGuideArticle,
  faqs: FUEL_PUMP_FAQS,
  countryRules: null,
};
