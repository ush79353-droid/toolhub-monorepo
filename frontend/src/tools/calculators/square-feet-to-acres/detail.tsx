import type { ToolPageDetail } from '@/tools/page-detail';
import { SquareFeetToAcresGuideArticle } from './SquareFeetToAcresGuideArticle';
import { SQFT_TO_ACRES_FAQS, SQFT_TO_ACRES_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert square feet to acres and back with the exact 43,560 factor — plus optional m², yd², ha, and more.',
  asideAriaLabel: 'Interactive square feet to acres calculator',
  tocItems: SQFT_TO_ACRES_TOC_ITEMS,
  GuideArticle: SquareFeetToAcresGuideArticle,
  faqs: SQFT_TO_ACRES_FAQS,
  countryRules: null,
};
