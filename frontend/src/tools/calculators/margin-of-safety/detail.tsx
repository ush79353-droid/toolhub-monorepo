import type { ToolPageDetail } from '@/tools/page-detail';
import { MarginOfSafetyGuideArticle } from './MarginOfSafetyGuideArticle';
import { MARGIN_OF_SAFETY_FAQS, MARGIN_OF_SAFETY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compute margin of safety from current and breakeven sales, with optional per-unit fields and real currency conversion on every money selector.',
  asideAriaLabel: 'Interactive Margin of Safety Calculator',
  tocItems: MARGIN_OF_SAFETY_TOC_ITEMS,
  GuideArticle: MarginOfSafetyGuideArticle,
  faqs: MARGIN_OF_SAFETY_FAQS,
  countryRules: null,
};
