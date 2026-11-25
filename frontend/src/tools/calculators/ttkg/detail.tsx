import type { ToolPageDetail } from '@/tools/page-detail';
import { TtkgGuideArticle } from './TtkgGuideArticle';
import { TTKG_FAQS, TTKG_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational transtubular potassium gradient from serum and urine potassium and osmolality — not a standalone diagnosis.',
  asideAriaLabel: 'Interactive TTKG Calculator',
  tocItems: TTKG_TOC_ITEMS,
  GuideArticle: TtkgGuideArticle,
  faqs: TTKG_FAQS,
  countryRules: null,
};