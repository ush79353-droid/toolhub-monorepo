import type { ToolPageDetail } from '@/tools/page-detail';
import { CompoundInterestGuideArticle } from './CompoundInterestGuideArticle';
import { COMPOUND_INTEREST_FAQS, COMPOUND_INTEREST_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate compound interest final balance and interest earned, with optional recurring deposits and yearly balance views.',
  asideAriaLabel: 'Interactive compound interest calculator',
  tocItems: COMPOUND_INTEREST_TOC_ITEMS,
  GuideArticle: CompoundInterestGuideArticle,
  faqs: COMPOUND_INTEREST_FAQS,
  countryRules: null,
};
