import type { ToolPageDetail } from '@/tools/page-detail';
import { KidneyFailureRiskGuideArticle } from './KidneyFailureRiskGuideArticle';
import {
  KIDNEY_FAILURE_RISK_FAQS,
  KIDNEY_FAILURE_RISK_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational Tangri 2011 eight-variable categorical kidney failure risk points (pts) for CKD G3–G5 — not continuous KFRE and not a treatment recommendation.',
  asideAriaLabel: 'Interactive Kidney Failure Risk Calculator',
  tocItems: KIDNEY_FAILURE_RISK_TOC_ITEMS,
  GuideArticle: KidneyFailureRiskGuideArticle,
  faqs: KIDNEY_FAILURE_RISK_FAQS,
  countryRules: null,
};
