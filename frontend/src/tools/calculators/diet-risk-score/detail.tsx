import type { ToolPageDetail } from '@/tools/page-detail';
import { DietRiskScoreGuideArticle } from './DietRiskScoreGuideArticle';
import { DIET_RISK_FAQS, DIET_RISK_TOC } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead: '9-item Diet Risk Score (DRS) food-frequency screener — educational nutrition screening.',
  asideAriaLabel: 'Interactive Diet Risk Score Calculator',
  tocItems: DIET_RISK_TOC,
  GuideArticle: DietRiskScoreGuideArticle,
  faqs: DIET_RISK_FAQS,
  countryRules: null,
};