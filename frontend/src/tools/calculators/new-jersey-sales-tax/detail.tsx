import type { ToolPageDetail } from '@/tools/page-detail';
import { NJ_SALES_TAX_FAQS, NJ_SALES_TAX_TOC_ITEMS } from './content';
import { NewJerseySalesTaxGuideArticle } from './NewJerseySalesTaxGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate New Jersey sales tax on a purchase using the statewide 6.625% rate and a valid NJ ZIP code; fixed USD, with clear limits on UEZ and product exemptions.',
  asideAriaLabel: 'Sales Tax Calculator New Jersey guide',
  tocItems: NJ_SALES_TAX_TOC_ITEMS,
  GuideArticle: NewJerseySalesTaxGuideArticle,
  faqs: NJ_SALES_TAX_FAQS,
  countryRules: null,
};
