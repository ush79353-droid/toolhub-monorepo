import type { ToolPageDetail } from '@/tools/page-detail';
import { PriceQuantityGuideArticle } from './PriceQuantityGuideArticle';
import { PQ_FAQS, PQ_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare two pack sizes by price per unit, then see what the larger quantity would have cost at the smaller unit price. Currency changes the symbol only.',
  asideAriaLabel: 'Interactive price quantity calculator',
  tocItems: PQ_TOC_ITEMS,
  GuideArticle: PriceQuantityGuideArticle,
  faqs: PQ_FAQS,
  countryRules: null,
};
