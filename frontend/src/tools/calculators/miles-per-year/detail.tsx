import type { ToolPageDetail } from '@/tools/page-detail';
import { MilesPerYearGuideArticle } from './MilesPerYearGuideArticle';
import { MPY_FAQS, MPY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate annual driving mileage from daily, weekly, monthly, or yearly distance — with optional commute schedule, fuel cost, and odometer projection.',
  asideAriaLabel: 'Interactive Miles per Year Calculator',
  tocItems: MPY_TOC_ITEMS,
  GuideArticle: MilesPerYearGuideArticle,
  faqs: MPY_FAQS,
  countryRules: null,
};
