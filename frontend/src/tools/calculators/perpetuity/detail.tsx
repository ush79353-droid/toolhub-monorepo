import type { ToolPageDetail } from '@/tools/page-detail';
import { PerpetuityGuideArticle } from './PerpetuityGuideArticle';
import { PERPETUITY_FAQS, PERPETUITY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate the present value of a level or constantly growing perpetuity from dividend, discount rate, and growth rate.',
  asideAriaLabel: 'Interactive Perpetuity Calculator',
  tocItems: PERPETUITY_TOC_ITEMS,
  GuideArticle: PerpetuityGuideArticle,
  faqs: PERPETUITY_FAQS,
  countryRules: null,
};
