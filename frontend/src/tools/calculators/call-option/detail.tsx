import type { ToolPageDetail } from '@/tools/page-detail';
import { CallOptionGuideArticle } from './CallOptionGuideArticle';
import { CALL_OPTION_FAQS, CALL_OPTION_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Use this Call Option Calculator to estimate the total premium paid for call or put contracts, plus simple break-even and intrinsic value at a chosen asset or target price. Quotes are treated as per-share premiums with a standard 100-share equity multiplier.',
  asideAriaLabel: 'Interactive Call Option Calculator',
  tocItems: CALL_OPTION_TOC_ITEMS,
  GuideArticle: CallOptionGuideArticle,
  faqs: CALL_OPTION_FAQS,
  countryRules: null,
};
