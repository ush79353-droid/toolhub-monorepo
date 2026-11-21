import type { ToolPageDetail } from '@/tools/page-detail';
import { MaintenanceCalorieGuideArticle } from './MaintenanceCalorieGuideArticle';
import {
  MAINTENANCE_CALORIE_FAQS,
  MAINTENANCE_CALORIE_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate daily maintenance calories with Mifflin–St Jeor and activity level, plus optional macro shares, ideal weight, and weight-change planning.',
  asideAriaLabel: 'Interactive Maintenance Calorie Calculator',
  tocItems: MAINTENANCE_CALORIE_TOC_ITEMS,
  GuideArticle: MaintenanceCalorieGuideArticle,
  faqs: MAINTENANCE_CALORIE_FAQS,
  countryRules: null,
};
