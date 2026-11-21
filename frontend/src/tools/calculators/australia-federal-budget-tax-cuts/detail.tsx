import type { ToolPageDetail } from '@/tools/page-detail';
import { AustraliaTaxCutsGuideArticle } from './AustraliaTaxCutsGuideArticle';
import {
  AUSTRALIA_TAX_CUTS_FAQS,
  AUSTRALIA_TAX_CUTS_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Historical notice about Australia Federal Budget 2020/21 income tax cuts. Not a current ATO tax calculator; this tool is unavailable and does not invent brackets or refunds.',
  asideAriaLabel: 'Australia Federal Budget 2020/21 income tax cuts notice',
  tocItems: AUSTRALIA_TAX_CUTS_TOC_ITEMS,
  GuideArticle: AustraliaTaxCutsGuideArticle,
  faqs: AUSTRALIA_TAX_CUTS_FAQS,
  countryRules: null,
};
