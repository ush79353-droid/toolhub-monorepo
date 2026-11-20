import type { ToolPageDetail } from '@/tools/page-detail';
import { CapRateGuideArticle } from './CapRateGuideArticle';
import { CAP_RATE_FAQS, CAP_RATE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate capitalization rate from net operating income and property value, reverse to an implied value from a target yield, or solve for required NOI — vacancy and operating expenses included, debt service excluded.',
  asideAriaLabel: 'Interactive Cap Rate Calculator',
  tocItems: CAP_RATE_TOC_ITEMS,
  GuideArticle: CapRateGuideArticle,
  faqs: CAP_RATE_FAQS,
  countryRules: null,
};
