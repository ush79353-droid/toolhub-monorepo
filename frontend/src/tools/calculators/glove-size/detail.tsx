import type { ToolPageDetail } from '@/tools/page-detail';
import { GloveSizeGuideArticle } from './GloveSizeGuideArticle';
import { GLOVE_SIZE_FAQS, GLOVE_SIZE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Find your approximate glove size from hand circumference with size charts for men and women and automatic unit conversion.',
  asideAriaLabel: 'Interactive Glove Size Calculator',
  tocItems: GLOVE_SIZE_TOC_ITEMS,
  GuideArticle: GloveSizeGuideArticle,
  faqs: GLOVE_SIZE_FAQS,
  countryRules: null,
};
