import type { ToolPageDetail } from '@/tools/page-detail';
import { TimiStemiGuideArticle } from './TimiStemiGuideArticle';
import { TIMI_STEMI_FAQS, TIMI_STEMI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational Morrow 2000 TIMI risk score for STEMI (0–14) with InTIME II 30-day mortality bands — not a triage or treatment order.',
  asideAriaLabel: 'Interactive TIMI Score for STEMI Calculator',
  tocItems: TIMI_STEMI_TOC_ITEMS,
  GuideArticle: TimiStemiGuideArticle,
  faqs: TIMI_STEMI_FAQS,
  countryRules: null,
};
