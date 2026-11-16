import type { ToolPageDetail } from '@/tools/page-detail';
import { SimpleMortgageGuideArticle } from './SimpleMortgageGuideArticle';
import { SIMPLE_MORTGAGE_FAQS, SIMPLE_MORTGAGE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate a fixed-rate mortgage monthly payment from loan amount, yearly rate, and term.',
  asideAriaLabel: 'Interactive Simple Mortgage Calculator',
  tocItems: SIMPLE_MORTGAGE_TOC_ITEMS,
  GuideArticle: SimpleMortgageGuideArticle,
  faqs: SIMPLE_MORTGAGE_FAQS,
  countryRules: null,
};
