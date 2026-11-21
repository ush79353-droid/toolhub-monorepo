import type { ToolPageDetail } from '@/tools/page-detail';
import { OhioSalesTaxGuideArticle } from './OhioSalesTaxGuideArticle';
import { OHIO_SALES_TAX_FAQS, OHIO_SALES_TAX_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Enter a USD purchase amount and Ohio ZIP to validate jurisdiction format. Combined rates are not invented without a verified ZIP tax table.',
  asideAriaLabel: 'Interactive Ohio Sales Tax Calculator',
  tocItems: OHIO_SALES_TAX_TOC_ITEMS,
  GuideArticle: OhioSalesTaxGuideArticle,
  faqs: OHIO_SALES_TAX_FAQS,
  countryRules: null,
};
