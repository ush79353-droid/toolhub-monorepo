import type { ToolPageDetail } from '@/tools/page-detail';
import { BodeIndexGuideArticle } from './BodeIndexGuideArticle';
import { BODE_FAQS, BODE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational BODE Index for COPD (BMI, FEV1, dyspnea, 6-minute walk) — Celli et al. NEJM 2004 point table, not a care order.',
  asideAriaLabel: 'Interactive BODE Index Calculator',
  tocItems: BODE_TOC_ITEMS,
  GuideArticle: BodeIndexGuideArticle,
  faqs: BODE_FAQS,
  countryRules: null,
};
