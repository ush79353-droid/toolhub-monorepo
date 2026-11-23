import type { ToolPageDetail } from '@/tools/page-detail';
import { VbacGuideArticle } from './VbacGuideArticle';
import { VBAC_FAQS, VBAC_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational Grobman 2021 MFMU VBAC success probability for early pregnancy counseling — race-neutral logistic model, share page URL only.',
  asideAriaLabel: 'Interactive VBAC Calculator',
  tocItems: VBAC_TOC_ITEMS,
  GuideArticle: VbacGuideArticle,
  faqs: VBAC_FAQS,
  countryRules: null,
};