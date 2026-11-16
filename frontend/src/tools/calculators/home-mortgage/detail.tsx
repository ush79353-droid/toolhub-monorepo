import type { ToolPageDetail } from '@/tools/page-detail';
import { HomeMortgageGuideArticle } from './HomeMortgageGuideArticle';
import { HOME_MORTGAGE_FAQS, HOME_MORTGAGE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate home-mortgage payments, interest, PMI, payoff date, and a principal-versus-interest breakdown — with independent FX on money fields.',
  asideAriaLabel: 'Interactive Home Mortgage Calculator',
  tocItems: HOME_MORTGAGE_TOC_ITEMS,
  GuideArticle: HomeMortgageGuideArticle,
  faqs: HOME_MORTGAGE_FAQS,
  countryRules: null,
};
