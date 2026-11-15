import type { ToolPageDetail } from '@/tools/page-detail';
import { LatLongToUtmGuideArticle } from './LatLongToUtmGuideArticle';
import { LAT_LONG_TO_UTM_FAQS, LAT_LONG_TO_UTM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert WGS84 latitude and longitude to UTM zone, easting, and northing using Decimal Degrees or DMS.',
  asideAriaLabel: 'Interactive lat long to UTM converter',
  tocItems: LAT_LONG_TO_UTM_TOC_ITEMS,
  GuideArticle: LatLongToUtmGuideArticle,
  faqs: LAT_LONG_TO_UTM_FAQS,
  countryRules: null,
};
