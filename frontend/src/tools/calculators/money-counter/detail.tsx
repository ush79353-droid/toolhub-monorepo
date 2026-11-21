import type { ToolPageDetail } from '@/tools/page-detail';
import { MoneyCounterGuideArticle } from './MoneyCounterGuideArticle';
import { MONEY_COUNTER_FAQS, MONEY_COUNTER_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Count banknotes and coins by denomination across major currencies. Currency selection changes face values only — no exchange-rate conversion.',
  asideAriaLabel: 'Interactive Money Counter Calculator',
  tocItems: MONEY_COUNTER_TOC_ITEMS,
  GuideArticle: MoneyCounterGuideArticle,
  faqs: MONEY_COUNTER_FAQS,
  countryRules: null,
};
