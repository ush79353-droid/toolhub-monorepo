import type { ToolPageDetail } from '@/tools/page-detail';
import { CompressionRatioToPsiGuideArticle } from './CompressionRatioToPsiGuideArticle';
import { CR_PSI_FAQS, CR_PSI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate theoretical engine compression pressure from compression ratio and atmospheric pressure — with simplified and polytropic models, absolute vs. gauge pressure, and reverse solves.',
  asideAriaLabel: 'Interactive Compression Ratio to PSI Calculator',
  tocItems: CR_PSI_TOC_ITEMS,
  GuideArticle: CompressionRatioToPsiGuideArticle,
  faqs: CR_PSI_FAQS,
  countryRules: null,
};
