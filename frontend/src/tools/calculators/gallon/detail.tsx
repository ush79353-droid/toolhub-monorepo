import type { ToolPageDetail } from '@/tools/page-detail';
import { GALLON_FAQS, GALLON_TOC_ITEMS } from './content';
import { GallonGuideArticle } from './GallonGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert US liquid, Imperial, and US dry gallons to liters, quarts, pints, cups, fluid ounces, and cubic units. Optional water-weight mode uses density.',
  asideAriaLabel: 'Interactive gallon calculator',
  tocItems: GALLON_TOC_ITEMS,
  GuideArticle: GallonGuideArticle,
  faqs: GALLON_FAQS,
  countryRules: null,
};
