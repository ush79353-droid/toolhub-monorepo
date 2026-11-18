import type { ToolPageDetail } from '@/tools/page-detail';
import { LotSizeToSqftGuideArticle } from './LotSizeToSqftGuideArticle';
import { LOT_SIZE_TO_SQFT_FAQS, LOT_SIZE_TO_SQFT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate rectangular lot size in square feet from width and length, convert area units, and optionally estimate total land price.',
  asideAriaLabel: 'Interactive lot size to square feet calculator',
  tocItems: LOT_SIZE_TO_SQFT_TOC_ITEMS,
  GuideArticle: LotSizeToSqftGuideArticle,
  faqs: LOT_SIZE_TO_SQFT_FAQS,
  countryRules: null,
};
