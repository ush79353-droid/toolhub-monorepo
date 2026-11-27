import type { ToolPageDetail } from '@/tools/page-detail';
import { SerumOsmolalityGuideArticle } from './SerumOsmolalityGuideArticle';
import {
  SERUM_OSMOLALITY_FAQS,
  SERUM_OSMOLALITY_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational improved serum osmolality with optional ethanol and osmotic gap — not a lab osmometer.',
  asideAriaLabel: 'Interactive Serum Osmolality Calculator',
  tocItems: SERUM_OSMOLALITY_TOC_ITEMS,
  GuideArticle: SerumOsmolalityGuideArticle,
  faqs: SERUM_OSMOLALITY_FAQS,
  countryRules: null,
};
