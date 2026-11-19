import type { ToolPageDetail } from '@/tools/page-detail';
import { FloridaSalesTaxGuideArticle } from './FloridaSalesTaxGuideArticle';
import {
  FLORIDA_SALES_TAX_FAQS,
  FLORIDA_SALES_TAX_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate Florida state sales tax and county discretionary surtax from purchase amount and ZIP, using FL DOR DR-15DSS 2026 rates and Census ZCTA→county mapping.',
  asideAriaLabel: 'Interactive Florida Sales Tax Calculator',
  tocItems: FLORIDA_SALES_TAX_TOC_ITEMS,
  GuideArticle: FloridaSalesTaxGuideArticle,
  faqs: FLORIDA_SALES_TAX_FAQS,
  countryRules: null,
};
