import type { ToolPageDetail } from '@/tools/page-detail';
import { JeansSizeGuideArticle } from './JeansSizeGuideArticle';
import { JEANS_SIZE_FAQS, JEANS_SIZE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    "Find your jeans size using waist and inseam measurements, with men's and women's sizing charts and international conversions.",
  asideAriaLabel: 'Interactive Jeans Size Calculator',
  tocItems: JEANS_SIZE_TOC_ITEMS,
  GuideArticle: JeansSizeGuideArticle,
  faqs: JEANS_SIZE_FAQS,
  countryRules: null,
};
