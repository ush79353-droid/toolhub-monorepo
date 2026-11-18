import type { ToolPageDetail } from '@/tools/page-detail';
import { AngleConversionGuideArticle } from './AngleConversionGuideArticle';
import { ANGLE_FAQS, ANGLE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert degrees, radians, gradians, turns, π radians, and DMS. Expand for arcminutes, mils, and microradians.',
  asideAriaLabel: 'Interactive angle conversion calculator',
  tocItems: ANGLE_TOC_ITEMS,
  GuideArticle: AngleConversionGuideArticle,
  faqs: ANGLE_FAQS,
  countryRules: null,
};
