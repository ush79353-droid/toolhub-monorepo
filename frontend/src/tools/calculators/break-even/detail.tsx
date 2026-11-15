import type { ToolPageDetail } from '@/tools/page-detail';
import { BreakEvenGuideArticle } from './BreakEvenGuideArticle';
import { BREAK_EVEN_FAQS, BREAK_EVEN_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Find margin, markup, units to sell, and break-even revenue from price, variable cost, and fixed costs. Currency changes the denomination only.',
  asideAriaLabel: 'Interactive break-even calculator',
  tocItems: BREAK_EVEN_TOC_ITEMS,
  GuideArticle: BreakEvenGuideArticle,
  faqs: BREAK_EVEN_FAQS,
  countryRules: null,
};
