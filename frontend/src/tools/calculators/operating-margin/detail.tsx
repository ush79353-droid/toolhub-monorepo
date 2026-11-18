import type { ToolPageDetail } from '@/tools/page-detail';
import { OperatingMarginGuideArticle } from './OperatingMarginGuideArticle';
import { OPERATING_MARGIN_FAQS, OPERATING_MARGIN_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compute operating income and operating margin from revenue, COGS, and operating expenses, with real currency conversion across independent money fields.',
  asideAriaLabel: 'Interactive Operating Margin Calculator',
  tocItems: OPERATING_MARGIN_TOC_ITEMS,
  GuideArticle: OperatingMarginGuideArticle,
  faqs: OPERATING_MARGIN_FAQS,
  countryRules: null,
};
