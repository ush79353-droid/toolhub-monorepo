import type { ToolPageDetail } from '@/tools/page-detail';
import { InterestOnlyMortgageGuideArticle } from './InterestOnlyMortgageGuideArticle';
import {
  INTEREST_ONLY_MORTGAGE_FAQS,
  INTEREST_ONLY_MORTGAGE_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate interest-only mortgage payments by frequency and optional IO-period totals.',
  asideAriaLabel: 'Interactive Interest-Only Mortgage Calculator',
  tocItems: INTEREST_ONLY_MORTGAGE_TOC_ITEMS,
  GuideArticle: InterestOnlyMortgageGuideArticle,
  faqs: INTEREST_ONLY_MORTGAGE_FAQS,
  countryRules: null,
};
