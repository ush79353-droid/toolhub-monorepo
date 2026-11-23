import type { ToolPageDetail } from '@/tools/page-detail';
import { PvrGuideArticle } from './PvrGuideArticle';
import { PVR_FAQS, PVR_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational pulmonary vascular resistance from mPAP, LAP, and cardiac output — Wood units × 80 → dyn·s·cm⁻⁵. Not a clinical decision.',
  asideAriaLabel: 'Interactive PVR Calculator',
  tocItems: PVR_TOC_ITEMS,
  GuideArticle: PvrGuideArticle,
  faqs: PVR_FAQS,
  countryRules: null,
};
