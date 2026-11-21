import type { ToolPageDetail } from '@/tools/page-detail';
import { CaliforniaSalesTaxGuideArticle } from './CaliforniaSalesTaxGuideArticle';
import {
  CALIFORNIA_SALES_TAX_FAQS,
  CALIFORNIA_SALES_TAX_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Enter a USD purchase amount with street, city, and California ZIP. Combined rates come from the official CDTFA Tax Rate API — never invented from ZIP alone.',
  asideAriaLabel: 'Interactive California Sales Tax Calculator',
  tocItems: CALIFORNIA_SALES_TAX_TOC_ITEMS,
  GuideArticle: CaliforniaSalesTaxGuideArticle,
  faqs: CALIFORNIA_SALES_TAX_FAQS,
  countryRules: null,
};
