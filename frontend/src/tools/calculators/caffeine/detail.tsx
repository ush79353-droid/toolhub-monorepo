import type { ToolPageDetail } from '@/tools/page-detail';
import { CaffeineGuideArticle } from './CaffeineGuideArticle';
import { CAFFEINE_FAQS, CAFFEINE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational daily caffeine intake from documented drink servings — population max values are upper limits, not goals.',
  asideAriaLabel: 'Interactive Caffeine Calculator',
  tocItems: CAFFEINE_TOC_ITEMS,
  GuideArticle: CaffeineGuideArticle,
  faqs: CAFFEINE_FAQS,
  countryRules: null,
};
