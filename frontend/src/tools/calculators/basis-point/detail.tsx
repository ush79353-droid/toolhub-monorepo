import type { ToolPageDetail } from '@/tools/page-detail';
import { BasisPointGuideArticle } from './BasisPointGuideArticle';
import { BASIS_POINT_FAQS, BASIS_POINT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead: 'Convert rates across decimal, percent, permille, and basis points.',
  asideAriaLabel: 'Interactive Basis Point Calculator',
  tocItems: BASIS_POINT_TOC_ITEMS,
  GuideArticle: BasisPointGuideArticle,
  faqs: BASIS_POINT_FAQS,
  countryRules: null,
};
