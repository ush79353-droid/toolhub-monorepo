import type { ToolPageDetail } from '@/tools/page-detail';
import { BladderVolumeGuideArticle } from './BladderVolumeGuideArticle';
import { BLADDER_VOLUME_FAQS, BLADDER_VOLUME_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate educational ultrasound bladder volume from three orthogonal diameters and a shape-specific coefficient (Bih et al. 1998).',
  asideAriaLabel: 'Interactive Bladder Volume Calculator',
  tocItems: BLADDER_VOLUME_TOC_ITEMS,
  GuideArticle: BladderVolumeGuideArticle,
  faqs: BLADDER_VOLUME_FAQS,
  countryRules: null,
};
