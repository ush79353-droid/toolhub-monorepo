import type { ToolPageDetail } from '@/tools/page-detail';
import { RetentionRatioGuideArticle } from './RetentionRatioGuideArticle';
import { RR_FAQS, RR_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate a company’s retention (plowback) ratio from net income and dividends paid, including period retained earnings and payout complementarity.',
  asideAriaLabel: 'Interactive Retention Ratio Calculator',
  tocItems: RR_TOC_ITEMS,
  GuideArticle: RetentionRatioGuideArticle,
  faqs: RR_FAQS,
  countryRules: null,
};
