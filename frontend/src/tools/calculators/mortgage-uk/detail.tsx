import type { ToolPageDetail } from '@/tools/page-detail';
import { MortgageUkGuideArticle } from './MortgageUkGuideArticle';
import { MORTGAGE_UK_FAQS, MORTGAGE_UK_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate UK mortgage interest-only and repayment amounts with optional taxes and insurance (fixed £).',
  asideAriaLabel: 'Interactive Mortgage Calculator UK',
  tocItems: MORTGAGE_UK_TOC_ITEMS,
  GuideArticle: MortgageUkGuideArticle,
  faqs: MORTGAGE_UK_FAQS,
  countryRules: null,
};
