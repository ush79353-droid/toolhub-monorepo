import type { ToolPageDetail } from '@/tools/page-detail';
import { InterestGuideArticle } from './InterestGuideArticle';
import { INTEREST_FAQS, INTEREST_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Project compound growth with contributions, tax, inflation, and a principal-vs-interest breakdown.',
  asideAriaLabel: 'Interactive Interest Calculator',
  tocItems: INTEREST_TOC_ITEMS,
  GuideArticle: InterestGuideArticle,
  faqs: INTEREST_FAQS,
  countryRules: null,
};
