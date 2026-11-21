import type { ToolPageDetail } from '@/tools/page-detail';
import { VteRiskPregnancyGuideArticle } from './VteRiskPregnancyGuideArticle';
import {
  VTE_RISK_PREGNANCY_FAQS,
  VTE_RISK_PREGNANCY_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational RCOG Green-top Guideline No. 37a Appendix III VTE risk-factor score for pregnancy and the puerperium. Totals checklist points with BMI obesity weighting — does not prescribe prophylaxis.',
  asideAriaLabel: 'Interactive VTE Risk Score Calculator in Pregnancy',
  tocItems: VTE_RISK_PREGNANCY_TOC_ITEMS,
  GuideArticle: VteRiskPregnancyGuideArticle,
  faqs: VTE_RISK_PREGNANCY_FAQS,
  countryRules: null,
};
