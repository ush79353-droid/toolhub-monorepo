import type { ToolPageDetail } from '@/tools/page-detail';
import { SimpleInterestGuideArticle } from './SimpleInterestGuideArticle';
import { SIMPLE_INTEREST_FAQS, SIMPLE_INTEREST_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead: 'Calculate total simple interest and final balance from principal, rate, and term.',
  asideAriaLabel: 'Interactive Simple Interest Calculator',
  tocItems: SIMPLE_INTEREST_TOC_ITEMS,
  GuideArticle: SimpleInterestGuideArticle,
  faqs: SIMPLE_INTEREST_FAQS,
  countryRules: null,
};
