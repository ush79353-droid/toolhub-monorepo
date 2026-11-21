import type { ToolPageDetail } from '@/tools/page-detail';
import { TexasTaxGuideArticle } from './TexasTaxGuideArticle';
import { TEXAS_TAX_FAQS, TEXAS_TAX_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate federal income tax, zero Texas state income tax, and county property tax from AGI and home value, fixed USD educational estimate (FICA omitted).',
  asideAriaLabel: 'Interactive Texas Tax Calculator',
  tocItems: TEXAS_TAX_TOC_ITEMS,
  GuideArticle: TexasTaxGuideArticle,
  faqs: TEXAS_TAX_FAQS,
  countryRules: null,
};