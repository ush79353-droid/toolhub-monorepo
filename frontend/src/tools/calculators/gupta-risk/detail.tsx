import type { ToolPageDetail } from '@/tools/page-detail';
import { GuptaRiskGuideArticle } from './GuptaRiskGuideArticle';
import { GUPTA_RISK_FAQS, GUPTA_RISK_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational Gupta perioperative MICA risk (% MI or cardiac arrest within 30 days). Uses age, functional status, ASA class, creatinine, and procedure — not medical advice.',
  asideAriaLabel: 'Interactive Gupta Risk Calculator',
  tocItems: GUPTA_RISK_TOC_ITEMS,
  GuideArticle: GuptaRiskGuideArticle,
  faqs: GUPTA_RISK_FAQS,
  countryRules: null,
};