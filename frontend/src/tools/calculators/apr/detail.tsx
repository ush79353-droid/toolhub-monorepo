import type { ToolPageDetail } from '@/tools/page-detail';
import { AprGuideArticle } from './AprGuideArticle';
import { APR_FAQS, APR_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate a loan’s annual percentage rate from the nominal interest rate, term, payment frequency, and qualifying finance fees using a cash-flow (actuarial) approach.',
  asideAriaLabel: 'Interactive APR Calculator',
  tocItems: APR_TOC_ITEMS,
  GuideArticle: AprGuideArticle,
  faqs: APR_FAQS,
  countryRules: null,
};
