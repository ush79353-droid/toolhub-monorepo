import type { ToolPageDetail } from '@/tools/page-detail';
import { DriveTimeGuideArticle } from './DriveTimeGuideArticle';
import { DRIVE_TIME_FAQS, DRIVE_TIME_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate driving duration, arrival or departure time, fuel use, and trip cost per passenger from distance, average speed, breaks, and fuel economy.',
  asideAriaLabel: 'Interactive Drive Time Calculator',
  tocItems: DRIVE_TIME_TOC_ITEMS,
  GuideArticle: DriveTimeGuideArticle,
  faqs: DRIVE_TIME_FAQS,
  countryRules: null,
};
