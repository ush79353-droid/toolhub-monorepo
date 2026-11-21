import type { ToolPageDetail } from '@/tools/page-detail';
import { YardToMeterGuideArticle } from './YardToMeterGuideArticle';
import { YARD_TO_METER_FAQS, YARD_TO_METER_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert yards to meters and meters to yards instantly; 1 yard equals exactly 0.9144 meters.',
  asideAriaLabel: 'Interactive yard to meter converter',
  tocItems: YARD_TO_METER_TOC_ITEMS,
  GuideArticle: YardToMeterGuideArticle,
  faqs: YARD_TO_METER_FAQS,
  countryRules: null,
};
