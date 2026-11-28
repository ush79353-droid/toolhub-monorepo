import type { ToolPageDetail } from '@/tools/page-detail';
import { CompressionRatioGuideArticle } from './CompressionRatioGuideArticle';
import { CR_FAQS, CR_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate static and dynamic engine compression ratios from bore, stroke, chamber, gasket, deck, and piston volumes — with displacement and clearance breakdowns.',
  asideAriaLabel: 'Interactive Compression Ratio Calculator',
  tocItems: CR_TOC_ITEMS,
  GuideArticle: CompressionRatioGuideArticle,
  faqs: CR_FAQS,
  countryRules: null,
};
