import type { ToolPageDetail } from '@/tools/page-detail';
import { DrawLengthGuideArticle } from './DrawLengthGuideArticle';
import { DRAW_LENGTH_FAQS, DRAW_LENGTH_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate archery draw length from wingspan (÷ 2.5) — educational anthropometry only.',
  asideAriaLabel: 'Interactive Draw Length Calculator',
  tocItems: DRAW_LENGTH_TOC_ITEMS,
  GuideArticle: DrawLengthGuideArticle,
  faqs: DRAW_LENGTH_FAQS,
  countryRules: null,
};
