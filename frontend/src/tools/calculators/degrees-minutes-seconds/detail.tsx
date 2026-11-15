import type { ToolPageDetail } from '@/tools/page-detail';
import { DegreesMinutesSecondsGuideArticle } from './DegreesMinutesSecondsGuideArticle';
import { DMS_FAQS, DMS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert degrees, minutes, and seconds to decimal degrees and back for general angles.',
  asideAriaLabel: 'Interactive degrees minutes seconds calculator',
  tocItems: DMS_TOC_ITEMS,
  GuideArticle: DegreesMinutesSecondsGuideArticle,
  faqs: DMS_FAQS,
  countryRules: null,
};
