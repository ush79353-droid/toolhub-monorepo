import type { ToolPageDetail } from '@/tools/page-detail';
import { MortgageTaxesInsuranceGuideArticle } from './MortgageTaxesInsuranceGuideArticle';
import { MORTGAGE_TAXES_FAQS, MORTGAGE_TAXES_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate mortgage payments with optional property tax, homeowners insurance, PMI, payoff date, and a payment breakdown — with independent FX on money fields.',
  asideAriaLabel: 'Interactive Mortgage with Taxes & Insurance Calculator',
  tocItems: MORTGAGE_TAXES_TOC_ITEMS,
  GuideArticle: MortgageTaxesInsuranceGuideArticle,
  faqs: MORTGAGE_TAXES_FAQS,
  countryRules: null,
};
