import type { ToolPageDetail } from '@/tools/page-detail';
import { ConversionGuideArticle } from './ConversionGuideArticle';
import { CONVERSION_FAQS, CONVERSION_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert length, mass, temperature, volume, time, speed, data storage, and more within one compatible measurement category.',
  asideAriaLabel: 'Interactive universal conversion calculator',
  tocItems: CONVERSION_TOC_ITEMS,
  GuideArticle: ConversionGuideArticle,
  faqs: CONVERSION_FAQS,
  countryRules: null,
};
