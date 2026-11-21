import type { ToolPageDetail } from '@/tools/page-detail';
import { MoneySupplyGuideArticle } from './MoneySupplyGuideArticle';
import { MONEY_SUPPLY_FAQS, MONEY_SUPPLY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate M0, monetary base, M1, and M2 using currency, deposits, and reserves. Explore monetary aggregates, formulas, and definition differences.',
  asideAriaLabel: 'Interactive Money Supply Calculator',
  tocItems: MONEY_SUPPLY_TOC_ITEMS,
  GuideArticle: MoneySupplyGuideArticle,
  faqs: MONEY_SUPPLY_FAQS,
  countryRules: null,
};
