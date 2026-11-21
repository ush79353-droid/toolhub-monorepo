import type { ToolPageDetail } from '@/tools/page-detail';
import { MarginAndSalesTaxGuideArticle } from './MarginAndSalesTaxGuideArticle';
import { MARGIN_SALES_TAX_FAQS, MARGIN_SALES_TAX_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Turn cost and markup into net price, margin, sales-taxed gross price, and profit — with independent FX on each money field.',
  asideAriaLabel: 'Interactive Margin and Sales Tax Calculator',
  tocItems: MARGIN_SALES_TAX_TOC_ITEMS,
  GuideArticle: MarginAndSalesTaxGuideArticle,
  faqs: MARGIN_SALES_TAX_FAQS,
  countryRules: null,
};
