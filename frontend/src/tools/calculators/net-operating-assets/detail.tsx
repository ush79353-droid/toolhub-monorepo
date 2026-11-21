import type { ToolPageDetail } from '@/tools/page-detail';
import { NetOperatingAssetsGuideArticle } from './NetOperatingAssetsGuideArticle';
import {
  NET_OPERATING_ASSETS_FAQS,
  NET_OPERATING_ASSETS_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate net operating assets as operating assets minus operating liabilities — cash, receivables, inventory, prepaid expenses, fixed assets, payables, and accruals.',
  asideAriaLabel: 'Interactive Net Operating Assets Calculator',
  tocItems: NET_OPERATING_ASSETS_TOC_ITEMS,
  GuideArticle: NetOperatingAssetsGuideArticle,
  faqs: NET_OPERATING_ASSETS_FAQS,
  countryRules: null,
};
