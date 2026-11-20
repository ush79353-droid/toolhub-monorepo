import type { ToolPageDetail } from '@/tools/page-detail';
import { EstateTaxGuideArticle } from './EstateTaxGuideArticle';
import { ESTATE_TAX_FAQS, ESTATE_TAX_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate 2026 federal estate tax from gross estate assets and allowable deductions (fixed USD).',
  asideAriaLabel: 'Interactive Estate Tax Calculator',
  tocItems: ESTATE_TAX_TOC_ITEMS,
  GuideArticle: EstateTaxGuideArticle,
  faqs: ESTATE_TAX_FAQS,
  countryRules: null,
};
