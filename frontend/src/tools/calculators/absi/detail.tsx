import type { ToolPageDetail } from '@/tools/page-detail';
import { AbsiGuideArticle } from './AbsiGuideArticle';
import { ABSI_FAQS, ABSI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compute A Body Shape Index (ABSI) and the NHANES age/sex z-score from height, weight, and waist — educational only.',
  asideAriaLabel: 'Interactive ABSI Calculator',
  tocItems: ABSI_TOC_ITEMS,
  GuideArticle: AbsiGuideArticle,
  faqs: ABSI_FAQS,
  countryRules: null,
};
