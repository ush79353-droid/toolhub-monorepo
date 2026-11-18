import type { ToolPageDetail } from '@/tools/page-detail';
import { NetDebtGuideArticle } from './NetDebtGuideArticle';
import { NET_DEBT_FAQS, NET_DEBT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate net debt from cash, short-term debt, and long-term debt line items with real FX conversion.',
  asideAriaLabel: 'Interactive Net Debt Calculator',
  tocItems: NET_DEBT_TOC_ITEMS,
  GuideArticle: NetDebtGuideArticle,
  faqs: NET_DEBT_FAQS,
  countryRules: null,
};
