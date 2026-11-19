import type { ToolPageDetail } from '@/tools/page-detail';
import { SilverMeltGuideArticle } from './SilverMeltGuideArticle';
import { SILVER_MELT_FAQS, SILVER_MELT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate silver melt value from weight, purity, and a pure-silver market price, with an optional alloy metal add-on. Currency changes formatting only.',
  asideAriaLabel: 'Silver Melt Calculator guide',
  tocItems: SILVER_MELT_TOC_ITEMS,
  GuideArticle: SilverMeltGuideArticle,
  faqs: SILVER_MELT_FAQS,
  countryRules: null,
};
