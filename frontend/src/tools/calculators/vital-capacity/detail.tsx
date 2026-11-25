import type { ToolPageDetail } from '@/tools/page-detail';
import { VitalCapacityGuideArticle } from './VitalCapacityGuideArticle';
import { VITAL_CAPACITY_FAQS, VITAL_CAPACITY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational predicted vital capacity from sex, age, and height — Baldwin anthropometric estimate, not spirometry.',
  asideAriaLabel: 'Interactive Vital Capacity Calculator',
  tocItems: VITAL_CAPACITY_TOC_ITEMS,
  GuideArticle: VitalCapacityGuideArticle,
  faqs: VITAL_CAPACITY_FAQS,
  countryRules: null,
};