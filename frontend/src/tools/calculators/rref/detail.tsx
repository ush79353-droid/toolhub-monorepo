import type { ToolPageDetail } from '@/tools/page-detail';
import { RREF_FAQS, RREF_TOC_ITEMS } from './content';
import { RrefGuideArticle } from './RrefGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Reduce any matrix to reduced row echelon form with exact fractions, step-by-step Gauss–Jordan operations, rank, pivot columns, and optional augmented-system analysis.',
  asideAriaLabel: 'Interactive RREF calculator',
  tocItems: RREF_TOC_ITEMS,
  GuideArticle: RrefGuideArticle,
  faqs: RREF_FAQS,
  countryRules: null,
};
