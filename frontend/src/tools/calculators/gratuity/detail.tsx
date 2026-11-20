import type { ToolPageDetail } from '@/tools/page-detail';
import { GratuityGuideArticle } from './GratuityGuideArticle';
import { GRATUITY_FAQS, GRATUITY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate end-of-service gratuity from final monthly salary + D.A. and tenure using the Indian Act 15/26 convention — labeled as a formula estimate with independent currency conversion.',
  asideAriaLabel: 'Interactive Gratuity Calculator',
  tocItems: GRATUITY_TOC_ITEMS,
  GuideArticle: GratuityGuideArticle,
  faqs: GRATUITY_FAQS,
  countryRules: null,
};
