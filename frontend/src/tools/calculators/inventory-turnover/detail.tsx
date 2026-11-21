import type { ToolPageDetail } from '@/tools/page-detail';
import { InventoryTurnoverGuideArticle } from './InventoryTurnoverGuideArticle';
import {
  INVENTORY_TURNOVER_FAQS,
  INVENTORY_TURNOVER_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate inventory turnover and inventory days from COGS, beginning and ending inventory, and the accounting period length.',
  asideAriaLabel: 'Interactive Inventory Turnover Calculator',
  tocItems: INVENTORY_TURNOVER_TOC_ITEMS,
  GuideArticle: InventoryTurnoverGuideArticle,
  faqs: INVENTORY_TURNOVER_FAQS,
  countryRules: null,
};
