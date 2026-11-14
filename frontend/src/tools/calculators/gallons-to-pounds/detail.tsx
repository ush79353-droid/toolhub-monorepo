import type { ToolPageDetail } from '@/tools/page-detail';
import { GALLONS_TO_POUNDS_FAQS, GALLONS_TO_POUNDS_TOC_ITEMS } from './content';
import { GallonsToPoundsGuideArticle } from './GallonsToPoundsGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert gallons to pounds and pounds to gallons using liquid density. US liquid, Imperial, and US dry gallon standards are clearly distinguished.',
  asideAriaLabel: 'Interactive gallons to pounds conversion calculator',
  tocItems: GALLONS_TO_POUNDS_TOC_ITEMS,
  GuideArticle: GallonsToPoundsGuideArticle,
  faqs: GALLONS_TO_POUNDS_FAQS,
  countryRules: null,
};
