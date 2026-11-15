import type { ToolPageDetail } from '@/tools/page-detail';
import { CostOfGoodsSoldGuideArticle } from './CostOfGoodsSoldGuideArticle';
import { COGS_FAQS, COGS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate cost of goods sold from beginning inventory, purchases, and ending inventory.',
  asideAriaLabel: 'Interactive Cost of Goods Sold Calculator',
  tocItems: COGS_TOC_ITEMS,
  GuideArticle: CostOfGoodsSoldGuideArticle,
  faqs: COGS_FAQS,
  countryRules: null,
};
