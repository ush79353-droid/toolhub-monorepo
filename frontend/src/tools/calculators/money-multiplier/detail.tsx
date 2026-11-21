import type { ToolPageDetail } from '@/tools/page-detail';
import { MoneyMultiplierGuideArticle } from './MoneyMultiplierGuideArticle';
import {
  MONEY_MULTIPLIER_FAQS,
  MONEY_MULTIPLIER_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate the money multiplier from checkable deposits, bank reserves, and currency in circulation. Explore monetary base, money supply, formulas, and model limits.',
  asideAriaLabel: 'Interactive Money Multiplier Calculator',
  tocItems: MONEY_MULTIPLIER_TOC_ITEMS,
  GuideArticle: MoneyMultiplierGuideArticle,
  faqs: MONEY_MULTIPLIER_FAQS,
  countryRules: null,
};
