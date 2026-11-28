import type { ToolPageDetail } from '@/tools/page-detail';
import { JacketSizeGuideArticle } from './JacketSizeGuideArticle';
import { JACKET_SIZE_FAQS, JACKET_SIZE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    "Estimate men's and women's jacket sizes using height and chest measurements, with regional conversions and practical sizing guidance.",
  asideAriaLabel: 'Interactive Jacket Size Calculator',
  tocItems: JACKET_SIZE_TOC_ITEMS,
  GuideArticle: JacketSizeGuideArticle,
  faqs: JACKET_SIZE_FAQS,
  countryRules: null,
};
