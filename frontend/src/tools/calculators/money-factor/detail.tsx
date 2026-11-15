import type { ToolPageDetail } from '@/tools/page-detail';
import { MoneyFactorGuideArticle } from './MoneyFactorGuideArticle';
import { MONEY_FACTOR_FAQS, MONEY_FACTOR_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead: 'Convert annual interest rate (%) and lease money factor with the 2400 rule.',
  asideAriaLabel: 'Interactive Money Factor Calculator',
  tocItems: MONEY_FACTOR_TOC_ITEMS,
  GuideArticle: MoneyFactorGuideArticle,
  faqs: MONEY_FACTOR_FAQS,
  countryRules: null,
};
