import type { ToolPageDetail } from '@/tools/page-detail';
import { SalesTaxGuideArticle } from './SalesTaxGuideArticle';
import { SALES_TAX_FAQS, SALES_TAX_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Add or remove sales tax from a price using any tax rate, with independent FX on money fields.',
  asideAriaLabel: 'Interactive Sales Tax Calculator',
  tocItems: SALES_TAX_TOC_ITEMS,
  GuideArticle: SalesTaxGuideArticle,
  faqs: SALES_TAX_FAQS,
  countryRules: null,
};
