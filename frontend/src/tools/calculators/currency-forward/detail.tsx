import type { ToolPageDetail } from '@/tools/page-detail';
import { CurrencyForwardGuideArticle } from './CurrencyForwardGuideArticle';
import {
  CURRENCY_FORWARD_FAQS,
  CURRENCY_FORWARD_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate theoretical currency forward rates from spot exchange rates, interest rates, and contract duration.',
  asideAriaLabel: 'Interactive Currency Forward Calculator',
  tocItems: CURRENCY_FORWARD_TOC_ITEMS,
  GuideArticle: CurrencyForwardGuideArticle,
  faqs: CURRENCY_FORWARD_FAQS,
  countryRules: null,
};
