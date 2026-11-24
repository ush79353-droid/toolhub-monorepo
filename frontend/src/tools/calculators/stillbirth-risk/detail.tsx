import type { ToolPageDetail } from '@/tools/page-detail';
import { StillbirthRiskGuideArticle } from './GuideArticle';
import {
  STILLBIRTH_RISK_FAQS,
  STILLBIRTH_RISK_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational Trudell 2017 ≥32-week stillbirth probability — calibrated US logistic model, share page URL only.',
  asideAriaLabel: 'Interactive Stillbirth Risk Calculator',
  tocItems: STILLBIRTH_RISK_TOC_ITEMS,
  GuideArticle: StillbirthRiskGuideArticle,
  faqs: STILLBIRTH_RISK_FAQS,
  countryRules: null,
};