import type { ToolPageDetail } from '@/tools/page-detail';
import { PercentOffGuideArticle } from './PercentOffGuideArticle';
import { PERCENT_OFF_FAQS, PERCENT_OFF_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate percent-off discounts, sale prices, total savings, stacked discounts, and optional sales tax — or work reverse modes.',
  asideAriaLabel: 'Interactive Percent Off Calculator',
  tocItems: PERCENT_OFF_TOC_ITEMS,
  GuideArticle: PercentOffGuideArticle,
  faqs: PERCENT_OFF_FAQS,
  countryRules: null,
};
