import type { ToolPageDetail } from '@/tools/page-detail';
import { EggFreezingGuideArticle } from './EggFreezingGuideArticle';
import { EGG_FREEZING_FAQS, EGG_FREEZING_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational Goldman 2017 modeled chance of at least one live birth from frozen mature eggs by age at freezing — not a guarantee.',
  asideAriaLabel: 'Interactive Egg Freezing Calculator',
  tocItems: EGG_FREEZING_TOC_ITEMS,
  GuideArticle: EggFreezingGuideArticle,
  faqs: EGG_FREEZING_FAQS,
  countryRules: null,
};
