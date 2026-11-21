import type { ToolPageDetail } from '@/tools/page-detail';
import { MarkupGuideArticle } from './MarkupGuideArticle';
import { MARKUP_FAQS, MARKUP_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate product markup percentage, selling price, cost, and unit profit — or work any two compatible values in reverse.',
  asideAriaLabel: 'Interactive Markup Calculator',
  tocItems: MARKUP_TOC_ITEMS,
  GuideArticle: MarkupGuideArticle,
  faqs: MARKUP_FAQS,
  countryRules: null,
};
