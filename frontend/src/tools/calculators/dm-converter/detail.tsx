import type { ToolPageDetail } from '@/tools/page-detail';
import { DmConverterGuideArticle } from './DmConverterGuideArticle';
import { DM_FAQS, DM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert decimeters (dm) to meters, centimeters, millimeters, feet, inches, and more — 1 dm = 0.1 m.',
  asideAriaLabel: 'Interactive dm converter',
  tocItems: DM_TOC_ITEMS,
  GuideArticle: DmConverterGuideArticle,
  faqs: DM_FAQS,
  countryRules: null,
};
