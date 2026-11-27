import type { ToolPageDetail } from '@/tools/page-detail';
import { BodyShapeGuideArticle } from './BodyShapeGuideArticle';
import { BODY_SHAPE_FAQS, BODY_SHAPE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Find your apparel body shape from bust, waist, high hip, and hip — educational only.',
  asideAriaLabel: 'Interactive Body Shape Calculator',
  tocItems: BODY_SHAPE_TOC_ITEMS,
  GuideArticle: BodyShapeGuideArticle,
  faqs: BODY_SHAPE_FAQS,
  countryRules: null,
};