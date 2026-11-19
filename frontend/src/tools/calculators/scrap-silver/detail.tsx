import type { ToolPageDetail } from '@/tools/page-detail';
import { ScrapSilverGuideArticle } from './ScrapSilverGuideArticle';
import { SCRAP_SILVER_FAQS, SCRAP_SILVER_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate scrap silver melt value from weight, purity, and a pure-silver market price, with optional dealer adjustments. Currency changes formatting only.',
  asideAriaLabel: 'Scrap Silver Calculator guide',
  tocItems: SCRAP_SILVER_TOC_ITEMS,
  GuideArticle: ScrapSilverGuideArticle,
  faqs: SCRAP_SILVER_FAQS,
  countryRules: null,
};
