import type { ToolPageDetail } from '@/tools/page-detail';
import { QuartsToGallonsGuideArticle } from './QuartsToGallonsGuideArticle';
import { QUARTS_TO_GALLONS_FAQS, QUARTS_TO_GALLONS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert quarts to gallons and gallons to quarts. Default US liquid: 1 gal = 4 qt.',
  asideAriaLabel: 'Interactive quarts to gallons converter',
  tocItems: QUARTS_TO_GALLONS_TOC_ITEMS,
  GuideArticle: QuartsToGallonsGuideArticle,
  faqs: QUARTS_TO_GALLONS_FAQS,
  countryRules: null,
};
