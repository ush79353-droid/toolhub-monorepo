import type { ToolPageDetail } from '@/tools/page-detail';
import { ChildTaxCreditGuideArticle } from './ChildTaxCreditGuideArticle';
import { CHILD_TAX_CREDIT_FAQS, CHILD_TAX_CREDIT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate the U.S. Child Tax Credit for tax year 2025 from filing status, AGI, and up to two children’s ages — after income phaseout, with ACTC left undetermined without earned-income inputs.',
  asideAriaLabel: 'Interactive Child Tax Credit Calculator',
  tocItems: CHILD_TAX_CREDIT_TOC_ITEMS,
  GuideArticle: ChildTaxCreditGuideArticle,
  faqs: CHILD_TAX_CREDIT_FAQS,
  countryRules: null,
};
