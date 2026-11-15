import type { ToolPageDetail } from '@/tools/page-detail';
import { CUBIC_FEET_FAQS, CUBIC_FEET_TOC_ITEMS } from './content';
import { CubicFeetGuideArticle } from './CubicFeetGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate cubic feet from length, width, and height with independent units for each dimension.',
  asideAriaLabel: 'Interactive cubic feet calculator',
  tocItems: CUBIC_FEET_TOC_ITEMS,
  GuideArticle: CubicFeetGuideArticle,
  faqs: CUBIC_FEET_FAQS,
  countryRules: null,
};
