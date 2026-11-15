import type { ToolPageDetail } from '@/tools/page-detail';
import { HighLowMethodGuideArticle } from './HighLowMethodGuideArticle';
import { HIGH_LOW_METHOD_FAQS, HIGH_LOW_METHOD_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Separate mixed costs into variable cost per unit and fixed cost using high and low activity points, then estimate total cost at units (x). Currency changes the denomination only.',
  asideAriaLabel: 'Interactive high-low method calculator',
  tocItems: HIGH_LOW_METHOD_TOC_ITEMS,
  GuideArticle: HighLowMethodGuideArticle,
  faqs: HIGH_LOW_METHOD_FAQS,
  countryRules: null,
};
