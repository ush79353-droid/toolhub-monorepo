import type { ToolPageDetail } from '@/tools/page-detail';
import { RadiansToDegreesGuideArticle } from './RadiansToDegreesGuideArticle';
import { RADIANS_TO_DEGREES_FAQS, RADIANS_TO_DEGREES_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert radians to degrees and degrees to radians using Math.PI — degrees = radians × 180/π.',
  asideAriaLabel: 'Interactive radians to degrees converter',
  tocItems: RADIANS_TO_DEGREES_TOC_ITEMS,
  GuideArticle: RadiansToDegreesGuideArticle,
  faqs: RADIANS_TO_DEGREES_FAQS,
  countryRules: null,
};
