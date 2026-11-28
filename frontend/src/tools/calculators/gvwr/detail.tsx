import type { ToolPageDetail } from '@/tools/page-detail';
import { GvwrGuideArticle } from './GvwrGuideArticle';
import { GVWR_FAQS, GVWR_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate loaded vehicle weight from tare and payload, then compare it with manufacturer GVWR for remaining capacity, utilization, and overload checks.',
  asideAriaLabel: 'Interactive GVWR Calculator',
  tocItems: GVWR_TOC_ITEMS,
  GuideArticle: GvwrGuideArticle,
  faqs: GVWR_FAQS,
  countryRules: null,
};
