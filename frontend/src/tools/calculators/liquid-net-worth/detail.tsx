import type { ToolPageDetail } from '@/tools/page-detail';
import { LiquidNetWorthGuideArticle } from './LiquidNetWorthGuideArticle';
import { LNW_FAQS, LNW_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Subtract total liabilities from total liquid assets to find liquid net worth. Currency changes the symbol only.',
  asideAriaLabel: 'Interactive liquid net worth calculator',
  tocItems: LNW_TOC_ITEMS,
  GuideArticle: LiquidNetWorthGuideArticle,
  faqs: LNW_FAQS,
  countryRules: null,
};
