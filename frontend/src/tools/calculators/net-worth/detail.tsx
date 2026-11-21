import type { ToolPageDetail } from '@/tools/page-detail';
import { NET_WORTH_FAQS, NET_WORTH_TOC_ITEMS } from './content';
import { NetWorthGuideArticle } from './NetWorthGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Add your assets, subtract your liabilities, and compare your net worth with Federal Reserve SCF 2022 US household benchmarks. Currency changes formatting only.',
  asideAriaLabel: 'Net Worth Calculator guide',
  tocItems: NET_WORTH_TOC_ITEMS,
  GuideArticle: NetWorthGuideArticle,
  faqs: NET_WORTH_FAQS,
  countryRules: null,
};
