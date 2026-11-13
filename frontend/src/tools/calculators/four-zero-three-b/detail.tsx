import type { ToolPageDetail } from '@/tools/page-detail';
import { FOUR_ZERO_THREE_B_FAQS, FOUR_ZERO_THREE_B_TOC_ITEMS } from './content';
import { FourZeroThreeBGuideArticle } from './FourZeroThreeBGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Project a 403(b) balance from salary, deferrals, and employer contributions, or solve the contribution a target needs. Figures are assumptions, not guaranteed returns.',
  asideAriaLabel: 'Interactive 403(b) calculator',
  tocItems: FOUR_ZERO_THREE_B_TOC_ITEMS,
  GuideArticle: FourZeroThreeBGuideArticle,
  faqs: FOUR_ZERO_THREE_B_FAQS,
  countryRules: null,
};
