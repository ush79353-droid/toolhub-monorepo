import type { ToolPageDetail } from '@/tools/page-detail';
import { DriGuideArticle } from './DriGuideArticle';
import { DRI_FAQS, DRI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate daily calorie needs and look up sex- and age-band Dietary Reference Intakes for macros, vitamins, and minerals.',
  asideAriaLabel: 'Interactive DRI Calculator',
  tocItems: DRI_TOC_ITEMS,
  GuideArticle: DriGuideArticle,
  faqs: DRI_FAQS,
  countryRules: null,
};
