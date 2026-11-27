import type { ToolPageDetail } from '@/tools/page-detail';
import { DripRateGuideArticle } from './DripRateGuideArticle';
import { DRIP_RATE_FAQS, DRIP_RATE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational IV drip rate from weight-based dose, concentration, and drop factor — not a pump order.',
  asideAriaLabel: 'Interactive Drip Rate Calculator',
  tocItems: DRIP_RATE_TOC_ITEMS,
  GuideArticle: DripRateGuideArticle,
  faqs: DRIP_RATE_FAQS,
  countryRules: null,
};
