import type { ToolPageDetail } from '@/tools/page-detail';
import { CrossExchangeRateGuideArticle } from './CrossExchangeRateGuideArticle';
import {
  CROSS_EXCHANGE_RATE_FAQS,
  CROSS_EXCHANGE_RATE_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Use our Cross Exchange Rate Calculator to derive the A/B (and B/A) cross rate from A/C and B/C quotes against a common bridge currency C. Enter one direction per pair — no live FX required.',
  asideAriaLabel: 'Interactive Cross Exchange Rate Calculator',
  tocItems: CROSS_EXCHANGE_RATE_TOC_ITEMS,
  GuideArticle: CrossExchangeRateGuideArticle,
  faqs: CROSS_EXCHANGE_RATE_FAQS,
  countryRules: null,
};
