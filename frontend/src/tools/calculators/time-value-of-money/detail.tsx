import type { ToolPageDetail } from '@/tools/page-detail';
import { TimeValueOfMoneyGuideArticle } from './TimeValueOfMoneyGuideArticle';
import { TIME_VALUE_OF_MONEY_FAQS, TIME_VALUE_OF_MONEY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert between present value and future value with compound interest, term, and compounding frequency.',
  asideAriaLabel: 'Interactive Time Value of Money Calculator',
  tocItems: TIME_VALUE_OF_MONEY_TOC_ITEMS,
  GuideArticle: TimeValueOfMoneyGuideArticle,
  faqs: TIME_VALUE_OF_MONEY_FAQS,
  countryRules: null,
};
