import type { ToolPageDetail } from '@/tools/page-detail';
import { RefinanceGuideArticle } from './RefinanceGuideArticle';
import { REFINANCE_FAQS, REFINANCE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare your remaining loan with a refinance offer — remaining term, new payment, closing costs, break-even, and net interest savings in USD.',
  asideAriaLabel: 'Interactive Refinance Calculator',
  tocItems: REFINANCE_TOC_ITEMS,
  GuideArticle: RefinanceGuideArticle,
  faqs: REFINANCE_FAQS,
  countryRules: null,
};
