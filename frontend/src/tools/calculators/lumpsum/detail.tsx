import type { ToolPageDetail } from '@/tools/page-detail';
import { LumpsumGuideArticle } from './LumpsumGuideArticle';
import { LUMPSUM_FAQS, LUMPSUM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate lumpsum future value, required starting capital, required return, or investment term with compounding and inflation adjustment.',
  asideAriaLabel: 'Interactive Lumpsum Calculator',
  tocItems: LUMPSUM_TOC_ITEMS,
  GuideArticle: LumpsumGuideArticle,
  faqs: LUMPSUM_FAQS,
  countryRules: null,
};
