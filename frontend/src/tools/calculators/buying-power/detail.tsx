import type { ToolPageDetail } from '@/tools/page-detail';
import { BuyingPowerGuideArticle } from './BuyingPowerGuideArticle';
import { BUYING_POWER_FAQS, BUYING_POWER_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare the purchasing power of money across different years using historical Consumer Price Index data and inflation-adjusted calculations.',
  asideAriaLabel: 'Interactive Buying Power Calculator',
  tocItems: BUYING_POWER_TOC_ITEMS,
  GuideArticle: BuyingPowerGuideArticle,
  faqs: BUYING_POWER_FAQS,
  countryRules: null,
};
