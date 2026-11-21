import type { ToolPageDetail } from '@/tools/page-detail';
import { CanadaGstQstGuideArticle } from './CanadaGstQstGuideArticle';
import { CANADA_GST_QST_FAQS, CANADA_GST_QST_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate Canadian GST, HST, PST/RST, or QST on a generally taxable purchase by province or territory using CRA-listed rates (CAD).',
  asideAriaLabel: 'Interactive GST/QST Calculator for Canada',
  tocItems: CANADA_GST_QST_TOC_ITEMS,
  GuideArticle: CanadaGstQstGuideArticle,
  faqs: CANADA_GST_QST_FAQS,
  countryRules: null,
};
