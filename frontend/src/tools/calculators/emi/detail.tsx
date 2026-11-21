import type { ToolPageDetail } from '@/tools/page-detail';
import { EmiGuideArticle } from './EmiGuideArticle';
import { EMI_FAQS, EMI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate equated monthly installments, total interest, repayment amount, and amortization for fixed-rate reducing-balance loans.',
  asideAriaLabel: 'Interactive EMI Calculator',
  tocItems: EMI_TOC_ITEMS,
  GuideArticle: EmiGuideArticle,
  faqs: EMI_FAQS,
  countryRules: null,
};
