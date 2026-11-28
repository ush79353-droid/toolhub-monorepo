import type { ToolPageDetail } from '@/tools/page-detail';
import { MilesToDollarsGuideArticle } from './MilesToDollarsGuideArticle';
import { MTD_FAQS, MTD_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate airline miles value in dollars, compare award redemptions with cash fares, and calculate effective cents per mile — loyalty miles, not geographic distance.',
  asideAriaLabel: 'Interactive Miles to Dollars Calculator',
  tocItems: MTD_TOC_ITEMS,
  GuideArticle: MilesToDollarsGuideArticle,
  faqs: MTD_FAQS,
  countryRules: null,
};
