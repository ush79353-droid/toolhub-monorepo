import type { ToolPageDetail } from '@/tools/page-detail';
import { HarrisBenedictGuideArticle } from './HarrisBenedictGuideArticle';
import { HARRIS_BENEDICT_FAQS, HARRIS_BENEDICT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Basal metabolic rate from the revised Harris–Benedict (Roza & Shizgal, 1984) equations — resting kcal/day only.',
  asideAriaLabel: 'Interactive Harris–Benedict Calculator',
  tocItems: HARRIS_BENEDICT_TOC_ITEMS,
  GuideArticle: HarrisBenedictGuideArticle,
  faqs: HARRIS_BENEDICT_FAQS,
  countryRules: null,
};
