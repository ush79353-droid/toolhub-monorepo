import type { ToolPageDetail } from '@/tools/page-detail';
import { TurnoverRateGuideArticle } from './TurnoverRateGuideArticle';
import { TURNOVER_RATE_FAQS, TURNOVER_RATE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate employee turnover rate from average headcount and employees who left.',
  asideAriaLabel: 'Interactive Turnover Rate Calculator',
  tocItems: TURNOVER_RATE_TOC_ITEMS,
  GuideArticle: TurnoverRateGuideArticle,
  faqs: TURNOVER_RATE_FAQS,
  countryRules: null,
};
