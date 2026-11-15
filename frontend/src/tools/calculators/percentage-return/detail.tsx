import type { ToolPageDetail } from '@/tools/page-detail';
import { PercentageReturnGuideArticle } from './PercentageReturnGuideArticle';
import { PERCENTAGE_RETURN_FAQS, PERCENTAGE_RETURN_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate gain or loss, holding-period percentage return, and annualized return—or solve for time needed.',
  asideAriaLabel: 'Interactive Percentage Return Calculator',
  tocItems: PERCENTAGE_RETURN_TOC_ITEMS,
  GuideArticle: PercentageReturnGuideArticle,
  faqs: PERCENTAGE_RETURN_FAQS,
  countryRules: null,
};
