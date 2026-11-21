import type { ToolPageDetail } from '@/tools/page-detail';
import { VAT_FAQS, VAT_TOC_ITEMS } from './content';
import { VatGuideArticle } from './VatGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Add or remove VAT with a custom rate, see synchronized net, VAT, and gross amounts, and switch display currency for formatting only — the default 20% rate is an example, not a universal country rate.',
  asideAriaLabel: 'VAT Calculator guide',
  tocItems: VAT_TOC_ITEMS,
  GuideArticle: VatGuideArticle,
  faqs: VAT_FAQS,
  countryRules: null,
};
