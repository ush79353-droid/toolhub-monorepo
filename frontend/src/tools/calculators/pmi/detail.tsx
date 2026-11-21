import type { ToolPageDetail } from '@/tools/page-detail';
import { PmiGuideArticle } from './PmiGuideArticle';
import { PMI_FAQS, PMI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate annual and monthly private mortgage insurance from home price, down payment (amount or percent), loan-to-value, and an assumed annual PMI rate, with simplified conventional applicability guidance.',
  asideAriaLabel: 'Interactive PMI Calculator',
  tocItems: PMI_TOC_ITEMS,
  GuideArticle: PmiGuideArticle,
  faqs: PMI_FAQS,
  countryRules: null,
};
