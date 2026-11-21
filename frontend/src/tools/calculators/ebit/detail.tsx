import type { ToolPageDetail } from '@/tools/page-detail';
import { EbitGuideArticle } from './EbitGuideArticle';
import { EBIT_FAQS, EBIT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate earnings before interest and taxes: EBIT = Revenue − Operating expenses; with reverse modes and EBIT margin.',
  asideAriaLabel: 'Interactive EBIT Calculator',
  tocItems: EBIT_TOC_ITEMS,
  GuideArticle: EbitGuideArticle,
  faqs: EBIT_FAQS,
  countryRules: null,
};
