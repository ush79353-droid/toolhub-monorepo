import type { ToolPageDetail } from '@/tools/page-detail';
import { BodySurfaceAreaGuideArticle } from './BodySurfaceAreaGuideArticle';
import {
  BODY_SURFACE_AREA_FAQS,
  BODY_SURFACE_AREA_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate body surface area with Du Bois, Mosteller, Haycock, and other published formulas — educational only.',
  asideAriaLabel: 'Interactive Body Surface Area Calculator',
  tocItems: BODY_SURFACE_AREA_TOC_ITEMS,
  GuideArticle: BodySurfaceAreaGuideArticle,
  faqs: BODY_SURFACE_AREA_FAQS,
  countryRules: null,
};
