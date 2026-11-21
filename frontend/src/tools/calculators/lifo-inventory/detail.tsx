import type { ToolPageDetail } from '@/tools/page-detail';
import { LifoInventoryGuideArticle } from './LifoInventoryGuideArticle';
import { LIFO_INVENTORY_FAQS, LIFO_INVENTORY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate LIFO Cost of Goods Sold, ending inventory, revenue, and gross margin from two purchase batches; newest costs enter COGS first.',
  asideAriaLabel: 'Interactive LIFO Calculator for Inventory',
  tocItems: LIFO_INVENTORY_TOC_ITEMS,
  GuideArticle: LifoInventoryGuideArticle,
  faqs: LIFO_INVENTORY_FAQS,
  countryRules: null,
};
