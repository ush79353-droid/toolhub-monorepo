import type { ToolPageDetail } from '@/tools/page-detail';
import { PlasmaOsmolalityGuideArticle } from './PlasmaOsmolalityGuideArticle';
import {
  PLASMA_OSMOLALITY_FAQS,
  PLASMA_OSMOLALITY_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational calculated plasma osmolality from sodium, glucose, and BUN — not a measured osmometer result.',
  asideAriaLabel: 'Interactive Plasma Osmolality Calculator',
  tocItems: PLASMA_OSMOLALITY_TOC_ITEMS,
  GuideArticle: PlasmaOsmolalityGuideArticle,
  faqs: PLASMA_OSMOLALITY_FAQS,
  countryRules: null,
};
