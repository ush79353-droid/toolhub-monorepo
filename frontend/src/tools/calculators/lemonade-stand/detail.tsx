import type { ToolPageDetail } from '@/tools/page-detail';
import { LemonadeStandGuideArticle } from './LemonadeStandGuideArticle';
import { LEMONADE_STAND_FAQS, LEMONADE_STAND_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate lemonade stand profit from servings, cup and ingredient costs, optional permit and other costs, and selling price. Enter your own costs, currency changes the denomination only.',
  asideAriaLabel: 'Interactive lemonade stand calculator',
  tocItems: LEMONADE_STAND_TOC_ITEMS,
  GuideArticle: LemonadeStandGuideArticle,
  faqs: LEMONADE_STAND_FAQS,
  countryRules: null,
};
