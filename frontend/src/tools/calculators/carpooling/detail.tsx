import type { ToolPageDetail } from '@/tools/page-detail';
import { CarpoolingGuideArticle } from './CarpoolingGuideArticle';
import { CARPOOLING_FAQS, CARPOOLING_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate trip fuel costs, split expenses among passengers, and compare shared rides with separate-vehicle scenarios — with round trips and optional fees.',
  asideAriaLabel: 'Interactive Carpooling Calculator',
  tocItems: CARPOOLING_TOC_ITEMS,
  GuideArticle: CarpoolingGuideArticle,
  faqs: CARPOOLING_FAQS,
  countryRules: null,
};
