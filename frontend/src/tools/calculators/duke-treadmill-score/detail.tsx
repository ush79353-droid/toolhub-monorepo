import type { ToolPageDetail } from '@/tools/page-detail';
import { DukeTreadmillScoreGuideArticle } from './DukeTreadmillScoreGuideArticle';
import { DUKE_TREADMILL_FAQS, DUKE_TREADMILL_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational Mark Duke treadmill score from Bruce exercise minutes, ST deviation, and angina index — not a procedure recommendation.',
  asideAriaLabel: 'Interactive Duke Treadmill Score Calculator',
  tocItems: DUKE_TREADMILL_TOC_ITEMS,
  GuideArticle: DukeTreadmillScoreGuideArticle,
  faqs: DUKE_TREADMILL_FAQS,
  countryRules: null,
};
