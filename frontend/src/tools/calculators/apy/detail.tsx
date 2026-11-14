import type { ToolPageDetail } from '@/tools/page-detail';
import { ApyGuideArticle } from './ApyGuideArticle';
import { APY_FAQS, APY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert APR to APY and project final deposit balance with compounding over months or years.',
  asideAriaLabel: 'Interactive APY Calculator',
  tocItems: APY_TOC_ITEMS,
  GuideArticle: ApyGuideArticle,
  faqs: APY_FAQS,
  countryRules: null,
};
