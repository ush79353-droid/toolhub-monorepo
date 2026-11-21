import type { ToolPageDetail } from '@/tools/page-detail';
import { EbitdaGuideArticle } from './EbitdaGuideArticle';
import { EBITDA_FAQS, EBITDA_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate earnings before interest, taxes, depreciation, and amortization: EBITDA = Operating profit + Amortization + Depreciation; with reverse modes and optional EBITDA margin.',
  asideAriaLabel: 'Interactive EBITDA Calculator',
  tocItems: EBITDA_TOC_ITEMS,
  GuideArticle: EbitdaGuideArticle,
  faqs: EBITDA_FAQS,
  countryRules: null,
};
