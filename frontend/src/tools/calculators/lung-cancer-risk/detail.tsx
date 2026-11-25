import type { ToolPageDetail } from '@/tools/page-detail';
import { LungCancerRiskGuideArticle } from './LungCancerRiskGuideArticle';
import {
  LUNG_CANCER_RISK_FAQS,
  LUNG_CANCER_RISK_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational HUNT ever-smoker lung cancer risk at 6 and 16 years — not screening advice.',
  asideAriaLabel: 'Interactive Lung Cancer Risk Calculator',
  tocItems: LUNG_CANCER_RISK_TOC_ITEMS,
  GuideArticle: LungCancerRiskGuideArticle,
  faqs: LUNG_CANCER_RISK_FAQS,
  countryRules: null,
};