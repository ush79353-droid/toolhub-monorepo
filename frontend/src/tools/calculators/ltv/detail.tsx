import type { ToolPageDetail } from '@/tools/page-detail';
import { LtvGuideArticle } from './LtvGuideArticle';
import { LTV_FAQS, LTV_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate loan-to-value from purchase price, down payment, or loan amount, with independent FX on each money field.',
  asideAriaLabel: 'Interactive LTV Calculator',
  tocItems: LTV_TOC_ITEMS,
  GuideArticle: LtvGuideArticle,
  faqs: LTV_FAQS,
  countryRules: null,
};
