import type { ToolPageDetail } from '@/tools/page-detail';
import { EnergyGuideArticle } from './EnergyGuideArticle';
import { ENERGY_FAQS, ENERGY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert joules, kilocalories, kWh, electronvolts, therms, TNT equivalents, and more through a joule-based reference.',
  asideAriaLabel: 'Interactive energy conversion calculator',
  tocItems: ENERGY_TOC_ITEMS,
  GuideArticle: EnergyGuideArticle,
  faqs: ENERGY_FAQS,
  countryRules: null,
};
