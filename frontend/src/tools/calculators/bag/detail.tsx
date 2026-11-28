import type { ToolPageDetail } from '@/tools/page-detail';
import { BagGuideArticle } from './BagGuideArticle';
import { BAG_FAQS, BAG_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate fabric width and height for a folded-bottom tote (flat or boxed corners) from finished dimensions and sewing allowances.',
  asideAriaLabel: 'Interactive Bag Calculator',
  tocItems: BAG_TOC_ITEMS,
  GuideArticle: BagGuideArticle,
  faqs: BAG_FAQS,
  countryRules: null,
};
