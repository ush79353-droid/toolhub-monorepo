import type { ToolPageDetail } from '@/tools/page-detail';
import { MilesToHoursGuideArticle } from './MilesToHoursGuideArticle';
import { MTH_FAQS, MTH_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate travel time from distance and average speed — or solve for distance or required speed — with unit conversions and readable duration.',
  asideAriaLabel: 'Interactive Miles to Hours Converter',
  tocItems: MTH_TOC_ITEMS,
  GuideArticle: MilesToHoursGuideArticle,
  faqs: MTH_FAQS,
  countryRules: null,
};
