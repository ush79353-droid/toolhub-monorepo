import type { ToolPageDetail } from '@/tools/page-detail';
import { FaceShapeGuideArticle } from './FaceShapeGuideArticle';
import { FACE_SHAPE_FAQS, FACE_SHAPE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate face shape from simple measurements — Omega-defined aesthetic heuristic, not clinical validation.',
  asideAriaLabel: 'Interactive Face Shape Calculator',
  tocItems: FACE_SHAPE_TOC_ITEMS,
  GuideArticle: FaceShapeGuideArticle,
  faqs: FACE_SHAPE_FAQS,
  countryRules: null,
};