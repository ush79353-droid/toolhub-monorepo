import type { ToolPageDetail } from '@/tools/page-detail';
import { KathaToSqftGuideArticle } from './KathaToSqftGuideArticle';
import { KATHA_TO_SQFT_FAQS, KATHA_TO_SQFT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert regional katha land area to square feet and square meters — factors differ by location.',
  asideAriaLabel: 'Interactive katha to square feet converter',
  tocItems: KATHA_TO_SQFT_TOC_ITEMS,
  GuideArticle: KathaToSqftGuideArticle,
  faqs: KATHA_TO_SQFT_FAQS,
  countryRules: null,
};
