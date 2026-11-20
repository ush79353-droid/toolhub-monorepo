import type { ToolPageDetail } from '@/tools/page-detail';
import { EnterpriseValueGuideArticle } from './EnterpriseValueGuideArticle';
import { EV_FAQS, EV_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate enterprise value from market capitalization, debt, minority interest, preferred shares, and cash.',
  asideAriaLabel: 'Interactive Enterprise Value Calculator',
  tocItems: EV_TOC_ITEMS,
  GuideArticle: EnterpriseValueGuideArticle,
  faqs: EV_FAQS,
  countryRules: null,
};
