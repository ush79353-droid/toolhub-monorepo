import type { ToolPageDetail } from '@/tools/page-detail';
import { LandAreaGuideArticle } from './LandAreaGuideArticle';
import { LAND_AREA_FAQS, LAND_AREA_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate rectangular land area from length and width. Convert m², ft², acres, and hectares, and optionally estimate total land price.',
  asideAriaLabel: 'Interactive land area calculator',
  tocItems: LAND_AREA_TOC_ITEMS,
  GuideArticle: LandAreaGuideArticle,
  faqs: LAND_AREA_FAQS,
  countryRules: null,
};
