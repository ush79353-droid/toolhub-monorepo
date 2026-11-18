import type { ToolPageDetail } from '@/tools/page-detail';
import { InchToMeterGuideArticle } from './InchToMeterGuideArticle';
import { INCH_TO_METER_FAQS, INCH_TO_METER_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert inches to meters and meters to inches instantly — 1 inch equals exactly 0.0254 meters.',
  asideAriaLabel: 'Interactive inch to meter calculator',
  tocItems: INCH_TO_METER_TOC_ITEMS,
  GuideArticle: InchToMeterGuideArticle,
  faqs: INCH_TO_METER_FAQS,
  countryRules: null,
};
