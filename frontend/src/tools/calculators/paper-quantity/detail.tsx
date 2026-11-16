import type { ToolPageDetail } from '@/tools/page-detail';
import { PaperQuantityGuideArticle } from './PaperQuantityGuideArticle';
import { PAPER_QUANTITY_FAQS, PAPER_QUANTITY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert paper quantities between sheets, quires, reams, bundles, and bales using the modern 500-sheet ream standard.',
  asideAriaLabel: 'Interactive paper quantity converter',
  tocItems: PAPER_QUANTITY_TOC_ITEMS,
  GuideArticle: PaperQuantityGuideArticle,
  faqs: PAPER_QUANTITY_FAQS,
  countryRules: null,
};
