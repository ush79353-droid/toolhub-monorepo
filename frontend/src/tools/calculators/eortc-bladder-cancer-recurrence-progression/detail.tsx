import type { ToolPageDetail } from '@/tools/page-detail';
import { EortcBladderGuideArticle } from './EortcBladderGuideArticle';
import { EORTC_BLADDER_FAQS, EORTC_BLADDER_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational EORTC NMIBC recurrence and progression risk tables (Sylvester 2006) — not a treatment plan.',
  asideAriaLabel:
    'Interactive EORTC Bladder Cancer Recurrence and Progression Calculator',
  tocItems: EORTC_BLADDER_TOC_ITEMS,
  GuideArticle: EortcBladderGuideArticle,
  faqs: EORTC_BLADDER_FAQS,
  countryRules: null,
};
