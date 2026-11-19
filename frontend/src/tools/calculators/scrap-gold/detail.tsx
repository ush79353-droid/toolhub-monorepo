import type { ToolPageDetail } from '@/tools/page-detail';
import { ScrapGoldGuideArticle } from './ScrapGoldGuideArticle';
import { SCRAP_GOLD_FAQS, SCRAP_GOLD_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate scrap gold value from weight, karat or purity, and a pure-gold market price. Currency changes formatting only.',
  asideAriaLabel: 'Scrap Gold Calculator guide',
  tocItems: SCRAP_GOLD_TOC_ITEMS,
  GuideArticle: ScrapGoldGuideArticle,
  faqs: SCRAP_GOLD_FAQS,
  countryRules: null,
};
