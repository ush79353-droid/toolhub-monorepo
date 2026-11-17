import type { ToolPageDetail } from '@/tools/page-detail';
import { GrossRentMultiplierGuideArticle } from './GrossRentMultiplierGuideArticle';
import {
  GROSS_RENT_MULTIPLIER_FAQS,
  GROSS_RENT_MULTIPLIER_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compute gross rent multiplier from property price and gross rental income with independent FX on money fields.',
  asideAriaLabel: 'Interactive Gross Rent Multiplier Calculator',
  tocItems: GROSS_RENT_MULTIPLIER_TOC_ITEMS,
  GuideArticle: GrossRentMultiplierGuideArticle,
  faqs: GROSS_RENT_MULTIPLIER_FAQS,
  countryRules: null,
};
