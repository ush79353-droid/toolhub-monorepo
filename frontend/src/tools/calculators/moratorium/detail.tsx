import type { ToolPageDetail } from '@/tools/page-detail';
import { MoratoriumGuideArticle } from './MoratoriumGuideArticle';
import { MORATORIUM_FAQS, MORATORIUM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate how a loan payment moratorium changes accrued interest, outstanding balance, revised EMI, tenure, and total repayment cost.',
  asideAriaLabel: 'Interactive Moratorium Calculator',
  tocItems: MORATORIUM_TOC_ITEMS,
  GuideArticle: MoratoriumGuideArticle,
  faqs: MORATORIUM_FAQS,
  countryRules: null,
};
