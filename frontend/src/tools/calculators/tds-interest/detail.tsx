import type { ToolPageDetail } from '@/tools/page-detail';
import { TdsInterestGuideArticle } from './TdsInterestGuideArticle';
import { TDS_INTEREST_FAQS, TDS_INTEREST_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate India TDS late-deduction interest, late-payment interest, and Section 234E late-filing fees in INR.',
  asideAriaLabel: 'Interactive TDS Interest Calculator',
  tocItems: TDS_INTEREST_TOC_ITEMS,
  GuideArticle: TdsInterestGuideArticle,
  faqs: TDS_INTEREST_FAQS,
  countryRules: null,
};
