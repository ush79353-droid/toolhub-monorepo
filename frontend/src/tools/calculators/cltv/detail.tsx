import type { ToolPageDetail } from '@/tools/page-detail';
import { CltvGuideArticle } from './CltvGuideArticle';
import { CLTV_FAQS, CLTV_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate customer lifetime value from average purchase value, purchase frequency, and customer lifespan, with optional margin, CAC, and discounting.',
  asideAriaLabel: 'Interactive CLTV Calculator',
  tocItems: CLTV_TOC_ITEMS,
  GuideArticle: CltvGuideArticle,
  faqs: CLTV_FAQS,
  countryRules: null,
};
