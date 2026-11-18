import type { ToolPageDetail } from '@/tools/page-detail';
import { SquareInchToSquareFootGuideArticle } from './SquareInchToSquareFootGuideArticle';
import { IN2_FT2_FAQS, IN2_FT2_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert square inches to square feet and back with the exact factor 1 ft² = 144 in².',
  asideAriaLabel: 'Interactive square inch to square foot converter',
  tocItems: IN2_FT2_TOC_ITEMS,
  GuideArticle: SquareInchToSquareFootGuideArticle,
  faqs: IN2_FT2_FAQS,
  countryRules: null,
};
