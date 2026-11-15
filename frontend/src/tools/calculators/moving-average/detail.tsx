import type { ToolPageDetail } from '@/tools/page-detail';
import { MovingAverageGuideArticle } from './MovingAverageGuideArticle';
import { MOVING_AVERAGE_FAQS, MOVING_AVERAGE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate a simple moving average from a chronological price series and a chosen length.',
  asideAriaLabel: 'Interactive Moving Average Calculator',
  tocItems: MOVING_AVERAGE_TOC_ITEMS,
  GuideArticle: MovingAverageGuideArticle,
  faqs: MOVING_AVERAGE_FAQS,
  countryRules: null,
};
