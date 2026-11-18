import type { ToolPageDetail } from '@/tools/page-detail';
import { MortgagePrepaymentGuideArticle } from './MortgagePrepaymentGuideArticle';
import {
  MORTGAGE_PREPAYMENT_FAQS,
  MORTGAGE_PREPAYMENT_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare your fixed-rate mortgage schedule with periodic and lump-sum principal prepayments.',
  asideAriaLabel: 'Interactive Mortgage Prepayment Calculator',
  tocItems: MORTGAGE_PREPAYMENT_TOC_ITEMS,
  GuideArticle: MortgagePrepaymentGuideArticle,
  faqs: MORTGAGE_PREPAYMENT_FAQS,
  countryRules: null,
};
