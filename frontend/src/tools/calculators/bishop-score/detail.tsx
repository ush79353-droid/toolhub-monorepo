import type { ToolPageDetail } from '@/tools/page-detail';
import { BishopScoreGuideArticle } from './BishopScoreGuideArticle';
import { BISHOP_SCORE_FAQS, BISHOP_SCORE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational classic Bishop cervical-exam score (0–13). Totals dilation, effacement, consistency, station, and cervical position — does not recommend induction.',
  asideAriaLabel: 'Interactive Bishop Score Calculator',
  tocItems: BISHOP_SCORE_TOC_ITEMS,
  GuideArticle: BishopScoreGuideArticle,
  faqs: BISHOP_SCORE_FAQS,
  countryRules: null,
};
