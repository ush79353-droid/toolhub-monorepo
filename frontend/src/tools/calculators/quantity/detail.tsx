import type { ToolPageDetail } from '@/tools/page-detail';
import { QuantityGuideArticle } from './QuantityGuideArticle';
import { QUANTITY_FAQS, QUANTITY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert units, pairs, dozens, baker’s dozens, scores, grosses, and great grosses instantly.',
  asideAriaLabel: 'Interactive quantity converter',
  tocItems: QUANTITY_TOC_ITEMS,
  GuideArticle: QuantityGuideArticle,
  faqs: QUANTITY_FAQS,
  countryRules: null,
};
