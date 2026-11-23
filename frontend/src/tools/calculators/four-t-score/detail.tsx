import type { ToolPageDetail } from '@/tools/page-detail';
import { FourTScoreGuideArticle } from './FourTScoreGuideArticle';
import { FOUR_T_SCORE_FAQS, FOUR_T_SCORE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational 4Ts pretest probability score (0–8) for heparin-induced thrombocytopenia. Uses validated component weights and Blood 2012 PPV teaching bands — not a diagnosis or heparin order.',
  asideAriaLabel: 'Interactive 4T Score Calculator for HIT',
  tocItems: FOUR_T_SCORE_TOC_ITEMS,
  GuideArticle: FourTScoreGuideArticle,
  faqs: FOUR_T_SCORE_FAQS,
  countryRules: null,
};