import type { ToolPageDetail } from '@/tools/page-detail';
import { Fev1FvcGuideArticle } from './Fev1FvcGuideArticle';
import { FEV1_FVC_FAQS, FEV1_FVC_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational FEV1/FVC (Tiffeneau) measured ratio and Hankinson/Falaschetti predicted-ratio worksheet — not a spirometry diagnosis.',
  asideAriaLabel: 'Interactive FEV1/FVC Ratio Calculator',
  tocItems: FEV1_FVC_TOC_ITEMS,
  GuideArticle: Fev1FvcGuideArticle,
  faqs: FEV1_FVC_FAQS,
  countryRules: null,
};
