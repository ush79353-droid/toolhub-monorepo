import type { ToolPageDetail } from '@/tools/page-detail';
import { RcriGuideArticle } from './RcriGuideArticle';
import { RCRI_FAQS, RCRI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational Revised Cardiac Risk Index (six Lee factors) with CCS 2017 pooled estimates for 30-day death, MI, or cardiac arrest — not a surgical clearance tool.',
  asideAriaLabel: 'Interactive RCRI Calculator',
  tocItems: RCRI_TOC_ITEMS,
  GuideArticle: RcriGuideArticle,
  faqs: RCRI_FAQS,
  countryRules: null,
};
