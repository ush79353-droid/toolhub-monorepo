import type { ToolPageDetail } from '@/tools/page-detail';
import { CoordinatesGuideArticle } from './CoordinatesGuideArticle';
import { COORDINATES_FAQS, COORDINATES_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert latitude and longitude between Decimal Degrees, DMS, and DDM without changing the geographic location.',
  asideAriaLabel: 'Interactive coordinates converter',
  tocItems: COORDINATES_TOC_ITEMS,
  GuideArticle: CoordinatesGuideArticle,
  faqs: COORDINATES_FAQS,
  countryRules: null,
};
