import type { ToolPageDetail } from '@/tools/page-detail';
import { GOLD_MELT_FAQS, GOLD_MELT_TOC_ITEMS } from './content';
import { GoldMeltGuideArticle } from './GoldMeltGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate gold melt value from karat or custom purity, weight, and market price, then compare dealer bid and ask after a spread. Currency changes formatting only.',
  asideAriaLabel: 'Gold Melt Calculator guide',
  tocItems: GOLD_MELT_TOC_ITEMS,
  GuideArticle: GoldMeltGuideArticle,
  faqs: GOLD_MELT_FAQS,
  countryRules: null,
};
