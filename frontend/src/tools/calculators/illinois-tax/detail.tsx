import type { ToolPageDetail } from '@/tools/page-detail';
import { IllinoisTaxGuideArticle } from './IllinoisTaxGuideArticle';
import { ILLINOIS_TAX_FAQS, ILLINOIS_TAX_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate Illinois and federal income tax plus county property tax from AGI and home value—fixed USD educational estimate (FICA omitted).',
  asideAriaLabel: 'Interactive Illinois Tax Calculator',
  tocItems: ILLINOIS_TAX_TOC_ITEMS,
  GuideArticle: IllinoisTaxGuideArticle,
  faqs: ILLINOIS_TAX_FAQS,
  countryRules: null,
};
