import type { ToolPageDetail } from '@/tools/page-detail';
import { EndingInventoryGuideArticle } from './EndingInventoryGuideArticle';
import {
  ENDING_INVENTORY_FAQS,
  ENDING_INVENTORY_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate ending inventory and inventory turnover from starting inventory, net purchases, and COGS — or estimate COGS from turnover when COGS is unknown.',
  asideAriaLabel: 'Interactive Ending Inventory Calculator',
  tocItems: ENDING_INVENTORY_TOC_ITEMS,
  GuideArticle: EndingInventoryGuideArticle,
  faqs: ENDING_INVENTORY_FAQS,
  countryRules: null,
};
