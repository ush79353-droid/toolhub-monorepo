import type { ToolPageDetail } from '@/tools/page-detail';
import { EngineHoursGuideArticle } from './EngineHoursGuideArticle';
import { ENGINE_HOURS_FAQS, ENGINE_HOURS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert engine hours to estimated miles or kilometers, reverse distance into driving hours, and explore maintenance-equivalent mileage for idle time — with clear labels that stationary equivalents are not actual travel.',
  asideAriaLabel: 'Interactive Engine Hours to Miles Converter',
  tocItems: ENGINE_HOURS_TOC_ITEMS,
  GuideArticle: EngineHoursGuideArticle,
  faqs: ENGINE_HOURS_FAQS,
  countryRules: null,
};
