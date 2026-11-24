import type { ToolPageDetail } from '@/tools/page-detail';
import { TimiUanstemiGuideArticle } from './TimiUanstemiGuideArticle';
import { TIMI_UANSTEMI_FAQS, TIMI_UANSTEMI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational TIMI risk score for UA/NSTEMI (0–7) from Antman et al. JAMA 2000 — 14-day composite band framing only, not ACS treatment advice.',
  asideAriaLabel: 'Interactive TIMI Score Calculator for UA/NSTEMI',
  tocItems: TIMI_UANSTEMI_TOC_ITEMS,
  GuideArticle: TimiUanstemiGuideArticle,
  faqs: TIMI_UANSTEMI_FAQS,
  countryRules: null,
};
