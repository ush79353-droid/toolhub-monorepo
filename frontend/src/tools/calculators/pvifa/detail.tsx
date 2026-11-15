import type { ToolPageDetail } from '@/tools/page-detail';
import { PvifaGuideArticle } from './PvifaGuideArticle';
import { PVIFA_FAQS, PVIFA_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate the present value interest factor of an ordinary annuity from rate and periods.',
  asideAriaLabel: 'Interactive PVIFA Calculator',
  tocItems: PVIFA_TOC_ITEMS,
  GuideArticle: PvifaGuideArticle,
  faqs: PVIFA_FAQS,
  countryRules: null,
};
