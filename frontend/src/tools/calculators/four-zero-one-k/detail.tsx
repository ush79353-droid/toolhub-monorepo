import type { ToolPageDetail } from '@/tools/page-detail';
import { FOUR_ZERO_ONE_K_FAQS, FOUR_ZERO_ONE_K_TOC_ITEMS } from './content';
import { FourZeroOneKGuideArticle } from './FourZeroOneKGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Project a 401(k) balance from salary, deferrals, and employer contributions, or solve the contribution a target needs. Figures are assumptions, not guaranteed returns.',
  asideAriaLabel: 'Interactive 401(k) calculator',
  tocItems: FOUR_ZERO_ONE_K_TOC_ITEMS,
  GuideArticle: FourZeroOneKGuideArticle,
  faqs: FOUR_ZERO_ONE_K_FAQS,
  countryRules: null,
};
