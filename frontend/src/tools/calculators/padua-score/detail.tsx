import type { ToolPageDetail } from '@/tools/page-detail';
import { PaduaScoreGuideArticle } from './PaduaScoreGuideArticle';
import { PADUA_FAQS, PADUA_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational Padua Prediction Score (0–20) for medical-inpatient VTE risk framing — not a prophylaxis order.',
  asideAriaLabel: 'Interactive Padua Score Calculator',
  tocItems: PADUA_TOC_ITEMS,
  GuideArticle: PaduaScoreGuideArticle,
  faqs: PADUA_FAQS,
  countryRules: null,
};
