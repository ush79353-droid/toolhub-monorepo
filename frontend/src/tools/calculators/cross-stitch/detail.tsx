import type { ToolPageDetail } from '@/tools/page-detail';
import { CrossStitchGuideArticle } from './CrossStitchGuideArticle';
import { CROSS_STITCH_FAQS, CROSS_STITCH_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate finished cross-stitch dimensions, fabric cutting size with margins, stitch density, and optional floss estimates.',
  asideAriaLabel: 'Interactive Cross-Stitch Calculator',
  tocItems: CROSS_STITCH_TOC_ITEMS,
  GuideArticle: CrossStitchGuideArticle,
  faqs: CROSS_STITCH_FAQS,
  countryRules: null,
};
