import type { ToolPageDetail } from '@/tools/page-detail';
import { PricePerLiterToGallonGuideArticle } from './PricePerLiterToGallonGuideArticle';
import {
  PRICE_PER_LITER_TO_GALLON_FAQS,
  PRICE_PER_LITER_TO_GALLON_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert price per liter to price per gallon and reverse; US liquid (3.785411784 L) or Imperial (4.54609 L). Currency is denomination only.',
  asideAriaLabel: 'Interactive price per liter to price per gallon converter',
  tocItems: PRICE_PER_LITER_TO_GALLON_TOC_ITEMS,
  GuideArticle: PricePerLiterToGallonGuideArticle,
  faqs: PRICE_PER_LITER_TO_GALLON_FAQS,
  countryRules: null,
};
