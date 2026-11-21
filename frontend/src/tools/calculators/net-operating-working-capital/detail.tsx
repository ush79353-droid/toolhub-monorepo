import type { ToolPageDetail } from '@/tools/page-detail';
import { NetOperatingWorkingCapitalGuideArticle } from './NetOperatingWorkingCapitalGuideArticle';
import {
  NET_OPERATING_WORKING_CAPITAL_FAQS,
  NET_OPERATING_WORKING_CAPITAL_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate net operating working capital as current operating assets (cash, receivables, inventories) minus current operating liabilities (payables and accrued expenses).',
  asideAriaLabel: 'Interactive Net Operating Working Capital Calculator',
  tocItems: NET_OPERATING_WORKING_CAPITAL_TOC_ITEMS,
  GuideArticle: NetOperatingWorkingCapitalGuideArticle,
  faqs: NET_OPERATING_WORKING_CAPITAL_FAQS,
  countryRules: null,
};
