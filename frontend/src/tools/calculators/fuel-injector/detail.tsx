import type { ToolPageDetail } from '@/tools/page-detail';
import { FuelInjectorGuideArticle } from './FuelInjectorGuideArticle';
import { FUEL_INJ_FAQS, FUEL_INJ_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate required fuel injector flow from horsepower, BSFC, injector count, and duty cycle — with fuel/aspiration suggestions, density-based unit conversion, and optional pressure adjustment.',
  asideAriaLabel: 'Interactive Fuel Injector Calculator',
  tocItems: FUEL_INJ_TOC_ITEMS,
  GuideArticle: FuelInjectorGuideArticle,
  faqs: FUEL_INJ_FAQS,
  countryRules: null,
};
