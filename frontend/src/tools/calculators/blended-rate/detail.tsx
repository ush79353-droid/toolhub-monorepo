import type { ToolPageDetail } from '@/tools/page-detail';
import { BlendedRateGuideArticle } from './BlendedRateGuideArticle';
import { BLENDED_RATE_FAQS, BLENDED_RATE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate the balance-weighted average interest rate across multiple loans or debts, plus combined balance and simple interest estimates.',
  asideAriaLabel: 'Interactive Blended Rate Calculator',
  tocItems: BLENDED_RATE_TOC_ITEMS,
  GuideArticle: BlendedRateGuideArticle,
  faqs: BLENDED_RATE_FAQS,
  countryRules: null,
};
