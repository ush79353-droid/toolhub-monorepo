import type { ToolPageDetail } from '@/tools/page-detail';
import { MetersToFeetGuideArticle } from './MetersToFeetGuideArticle';
import { METERS_TO_FEET_FAQS, METERS_TO_FEET_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert meters to feet and feet to meters instantly using the exact international foot (1 ft = 0.3048 m).',
  asideAriaLabel: 'Interactive meters to feet converter',
  tocItems: METERS_TO_FEET_TOC_ITEMS,
  GuideArticle: MetersToFeetGuideArticle,
  faqs: METERS_TO_FEET_FAQS,
  countryRules: null,
};
