import type { ToolPageDetail } from '@/tools/page-detail';
import { MarginAndVatGuideArticle } from './MarginAndVatGuideArticle';
import { MARGIN_VAT_FAQS, MARGIN_VAT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Link cost, selling price, profit, margin, markup, and VAT — with independent FX on each money field.',
  asideAriaLabel: 'Interactive Margin and VAT Calculator',
  tocItems: MARGIN_VAT_TOC_ITEMS,
  GuideArticle: MarginAndVatGuideArticle,
  faqs: MARGIN_VAT_FAQS,
  countryRules: null,
};
