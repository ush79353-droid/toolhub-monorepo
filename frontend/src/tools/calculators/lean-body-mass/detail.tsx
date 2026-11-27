import type { ToolPageDetail } from '@/tools/page-detail';
import { LbmGuideArticle } from './LbmGuideArticle';
import { LBM_FAQS, LBM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate Boer lean body mass from sex, weight, and height — educational only.',
  asideAriaLabel: 'Interactive Lean Body Mass Calculator',
  tocItems: LBM_TOC_ITEMS,
  GuideArticle: LbmGuideArticle,
  faqs: LBM_FAQS,
  countryRules: null,
};
