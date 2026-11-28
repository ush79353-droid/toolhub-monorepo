import type { ToolPageDetail } from '@/tools/page-detail';
import { HexagonQuiltGuideArticle } from './HexagonQuiltGuideArticle';
import { HEX_QUILT_FAQS, HEX_QUILT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate hexagon quilt layouts, full and half hexagons, rows, columns, finished dimensions, and estimated fabric requirements.',
  asideAriaLabel: 'Interactive Hexagon Quilt Calculator',
  tocItems: HEX_QUILT_TOC_ITEMS,
  GuideArticle: HexagonQuiltGuideArticle,
  faqs: HEX_QUILT_FAQS,
  countryRules: null,
};
