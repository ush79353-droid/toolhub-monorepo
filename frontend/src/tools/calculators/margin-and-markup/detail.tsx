import type { ToolPageDetail } from '@/tools/page-detail';
import { MarginAndMarkupGuideArticle } from './MarginAndMarkupGuideArticle';
import { MARGIN_AND_MARKUP_FAQS, MARGIN_AND_MARKUP_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert between margin, markup, revenue, and profit with real FX on cost, revenue, and profit.',
  asideAriaLabel: 'Interactive Margin and Markup Calculator',
  tocItems: MARGIN_AND_MARKUP_TOC_ITEMS,
  GuideArticle: MarginAndMarkupGuideArticle,
  faqs: MARGIN_AND_MARKUP_FAQS,
  countryRules: null,
};
