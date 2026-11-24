import type { ToolPageDetail } from '@/tools/page-detail';
import { ProstateVolumeGuideArticle } from './ProstateVolumeGuideArticle';
import { PROSTATE_VOLUME_FAQS, PROSTATE_VOLUME_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate educational prostate volume with ellipsoid (π/6) or bullet (5π/24) formulas from length, height, and width, with optional PSA density.',
  asideAriaLabel: 'Interactive Prostate Volume Calculator',
  tocItems: PROSTATE_VOLUME_TOC_ITEMS,
  GuideArticle: ProstateVolumeGuideArticle,
  faqs: PROSTATE_VOLUME_FAQS,
  countryRules: null,
};
