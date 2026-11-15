import type { ToolPageDetail } from '@/tools/page-detail';
import { FutureValueGuideArticle } from './FutureValueGuideArticle';
import { FUTURE_VALUE_FAQS, FUTURE_VALUE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Project future value and interest from a starting amount, rate per period, and optional deposits.',
  asideAriaLabel: 'Interactive Future Value Calculator',
  tocItems: FUTURE_VALUE_TOC_ITEMS,
  GuideArticle: FutureValueGuideArticle,
  faqs: FUTURE_VALUE_FAQS,
  countryRules: null,
};
