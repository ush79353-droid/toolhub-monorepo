import type { ToolPageDetail } from '@/tools/page-detail';
import { TeslaChargingCostGuideArticle } from './TeslaChargingCostGuideArticle';
import { TCC_FAQS, TCC_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate Tesla charging and driving electricity costs from battery capacity, tariffs, and EV efficiency. Presets are illustrative estimates.',
  asideAriaLabel: 'Interactive Tesla Charging Cost Calculator',
  tocItems: TCC_TOC_ITEMS,
  GuideArticle: TeslaChargingCostGuideArticle,
  faqs: TCC_FAQS,
  countryRules: null,
};
