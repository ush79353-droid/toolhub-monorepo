import type { ToolPageDetail } from '@/tools/page-detail';
import { DressSizeGuideArticle } from './DressSizeGuideArticle';
import { DRESS_SIZE_FAQS, DRESS_SIZE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate your women’s dress size from bust, waist, and hip measurements with an international size chart and fit guidance.',
  asideAriaLabel: 'Interactive Dress Size Calculator',
  tocItems: DRESS_SIZE_TOC_ITEMS,
  GuideArticle: DressSizeGuideArticle,
  faqs: DRESS_SIZE_FAQS,
  countryRules: null,
};
