import type { ToolPageDetail } from '@/tools/page-detail';
import { GajToSqYdGuideArticle } from './GajToSqYdGuideArticle';
import { GAJ_TO_SQ_YD_FAQS, GAJ_TO_SQ_YD_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert land-area gaj to square yards (1:1) and optionally convert linear gaj to yards. 1 gaj = 1 yd² = 9 ft².',
  asideAriaLabel: 'Interactive gaj to square yard converter',
  tocItems: GAJ_TO_SQ_YD_TOC_ITEMS,
  GuideArticle: GajToSqYdGuideArticle,
  faqs: GAJ_TO_SQ_YD_FAQS,
  countryRules: null,
};
