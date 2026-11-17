import type { ToolPageDetail } from '@/tools/page-detail';
import { RentSplitGuideArticle } from './RentSplitGuideArticle';
import { RENT_SPLIT_FAQS, RENT_SPLIT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Split total rent fairly across bedrooms by headcount, with real FX on the rent amount.',
  asideAriaLabel: 'Interactive Rent Split Calculator',
  tocItems: RENT_SPLIT_TOC_ITEMS,
  GuideArticle: RentSplitGuideArticle,
  faqs: RENT_SPLIT_FAQS,
  countryRules: null,
};
