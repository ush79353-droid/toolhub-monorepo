import type { ToolPageDetail } from '@/tools/page-detail';
import { MortgageWithExtraPaymentsGuideArticle } from './MortgageWithExtraPaymentsGuideArticle';
import {
  MORTGAGE_WITH_EXTRA_PAYMENTS_FAQS,
  MORTGAGE_WITH_EXTRA_PAYMENTS_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare your original monthly mortgage schedule with accelerated frequencies, recurring extras, and lump-sum prepayments, using real FX on money fields.',
  asideAriaLabel: 'Interactive Mortgage with Extra Payments Calculator',
  tocItems: MORTGAGE_WITH_EXTRA_PAYMENTS_TOC_ITEMS,
  GuideArticle: MortgageWithExtraPaymentsGuideArticle,
  faqs: MORTGAGE_WITH_EXTRA_PAYMENTS_FAQS,
  countryRules: null,
};
