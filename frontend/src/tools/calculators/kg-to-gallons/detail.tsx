import type { ToolPageDetail } from '@/tools/page-detail';
import { KgToGallonsGuideArticle } from './KgToGallonsGuideArticle';
import { KG_TO_GALLONS_FAQS, KG_TO_GALLONS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert kilograms to gallons and gallons to kilograms using substance density.',
  asideAriaLabel: 'Interactive kg to gallons converter',
  tocItems: KG_TO_GALLONS_TOC_ITEMS,
  GuideArticle: KgToGallonsGuideArticle,
  faqs: KG_TO_GALLONS_FAQS,
  countryRules: null,
};
