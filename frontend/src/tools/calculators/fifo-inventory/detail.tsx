import type { ToolPageDetail } from '@/tools/page-detail';
import { FifoInventoryGuideArticle } from './FifoInventoryGuideArticle';
import { FIFO_INVENTORY_FAQS, FIFO_INVENTORY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Cost units sold with FIFO across two purchase batches, then see revenue, COGS, gross profit, and margin. Currency changes the denomination only.',
  asideAriaLabel: 'Interactive FIFO inventory calculator',
  tocItems: FIFO_INVENTORY_TOC_ITEMS,
  GuideArticle: FifoInventoryGuideArticle,
  faqs: FIFO_INVENTORY_FAQS,
  countryRules: null,
};
