import type { ToolPageDetail } from '@/tools/page-detail';
import { PeriodGuideArticle } from './PeriodGuideArticle';
import { PERIOD_FAQS, PERIOD_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational forecast of next periods, fertile window, and ovulation day from cycle length and last period start. Approximate calendar method only.',
  asideAriaLabel: 'Interactive Period Calculator',
  tocItems: PERIOD_TOC_ITEMS,
  GuideArticle: PeriodGuideArticle,
  faqs: PERIOD_FAQS,
  countryRules: null,
};
