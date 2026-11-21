import type { ToolPageDetail } from '@/tools/page-detail';
import { NavGuideArticle } from './NavGuideArticle';
import { NAV_FAQS, NAV_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate fund net asset value (NAV) and NAV per share from investments, cash, receivables, liabilities, and outstanding shares.',
  asideAriaLabel: 'Interactive NAV Calculator – Net Asset Value',
  tocItems: NAV_TOC_ITEMS,
  GuideArticle: NavGuideArticle,
  faqs: NAV_FAQS,
  countryRules: null,
};
