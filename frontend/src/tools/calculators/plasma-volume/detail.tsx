import type { ToolPageDetail } from '@/tools/page-detail';
import { PlasmaVolumeGuideArticle } from './PlasmaVolumeGuideArticle';
import { PLASMA_VOLUME_FAQS, PLASMA_VOLUME_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational adult plasma volume from weight and hematocrit, with optional Nadler/Lemmens height methods.',
  asideAriaLabel: 'Interactive Plasma Volume Calculator',
  tocItems: PLASMA_VOLUME_TOC_ITEMS,
  GuideArticle: PlasmaVolumeGuideArticle,
  faqs: PLASMA_VOLUME_FAQS,
  countryRules: null,
};
