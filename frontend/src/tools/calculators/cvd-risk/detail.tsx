import type { ToolPageDetail } from '@/tools/page-detail';
import { CvdRiskGuideArticle } from './CvdRiskGuideArticle';
import { CVD_RISK_FAQS, CVD_RISK_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    "Educational Framingham general CVD 10-year risk (D'Agostino 2008 lipid model) for ages 30–74.",
  asideAriaLabel: 'Interactive CVD Risk Calculator',
  tocItems: CVD_RISK_TOC_ITEMS,
  GuideArticle: CvdRiskGuideArticle,
  faqs: CVD_RISK_FAQS,
  countryRules: null,
};
