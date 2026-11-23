import type { ToolPageDetail } from '@/tools/page-detail';
import { HeartScoreGuideArticle } from './HeartScoreGuideArticle';
import { HEART_SCORE_FAQS, HEART_SCORE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational HEART score (0–10) from History, ECG, Age, Risk factors, and initial Troponin. Component arithmetic from Six/Backus — not ED disposition.',
  asideAriaLabel: 'Interactive HEART Score Calculator',
  tocItems: HEART_SCORE_TOC_ITEMS,
  GuideArticle: HeartScoreGuideArticle,
  faqs: HEART_SCORE_FAQS,
  countryRules: null,
};