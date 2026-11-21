import type { ToolPageDetail } from '@/tools/page-detail';
import { CurrencyGuideArticle } from './CurrencyGuideArticle';
import { CURRENCY_FAQS, CURRENCY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert an amount between currencies with live stored exchange rates, popular-currency filtering, and a timestamped result.',
  asideAriaLabel: 'Interactive Currency Calculator',
  tocItems: CURRENCY_TOC_ITEMS,
  GuideArticle: CurrencyGuideArticle,
  faqs: CURRENCY_FAQS,
  countryRules: null,
};
