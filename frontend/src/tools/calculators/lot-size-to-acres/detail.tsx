import type { ToolPageDetail } from '@/tools/page-detail';
import { LotSizeToAcresGuideArticle } from './LotSizeToAcresGuideArticle';
import { LOT_SIZE_TO_ACRES_FAQS, LOT_SIZE_TO_ACRES_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate rectangular lot size in acres from width and length, convert area units, and optionally estimate total land price.',
  asideAriaLabel: 'Interactive lot size to acres calculator',
  tocItems: LOT_SIZE_TO_ACRES_TOC_ITEMS,
  GuideArticle: LotSizeToAcresGuideArticle,
  faqs: LOT_SIZE_TO_ACRES_FAQS,
  countryRules: null,
};
