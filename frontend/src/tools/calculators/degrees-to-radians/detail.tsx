import type { ToolPageDetail } from '@/tools/page-detail';
import { DegreesToRadiansGuideArticle } from './DegreesToRadiansGuideArticle';
import { DEGREES_TO_RADIANS_FAQS, DEGREES_TO_RADIANS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert degrees to radians and back using Math.PI; radians = degrees × π/180.',
  asideAriaLabel: 'Interactive degrees to radians converter',
  tocItems: DEGREES_TO_RADIANS_TOC_ITEMS,
  GuideArticle: DegreesToRadiansGuideArticle,
  faqs: DEGREES_TO_RADIANS_FAQS,
  countryRules: null,
};
