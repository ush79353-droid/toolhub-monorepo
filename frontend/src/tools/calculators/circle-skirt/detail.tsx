import type { ToolPageDetail } from '@/tools/page-detail';
import { CircleSkirtGuideArticle } from './CircleSkirtGuideArticle';
import { CIRCLE_SKIRT_FAQS, CIRCLE_SKIRT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate waist radius, outer radius, radial cutting length, and hem circumference for full, 3/4, half, and quarter circle skirts.',
  asideAriaLabel: 'Interactive Circle Skirt Calculator',
  tocItems: CIRCLE_SKIRT_TOC_ITEMS,
  GuideArticle: CircleSkirtGuideArticle,
  faqs: CIRCLE_SKIRT_FAQS,
  countryRules: null,
};
