import type { ToolPageDetail } from '@/tools/page-detail';
import { ChurnRateGuideArticle } from './ChurnRateGuideArticle';
import { CHURN_RATE_FAQS, CHURN_RATE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate customer churn rate and estimated customer lifetime in periods from starting customers and customers lost.',
  asideAriaLabel: 'Interactive churn rate calculator',
  tocItems: CHURN_RATE_TOC_ITEMS,
  GuideArticle: ChurnRateGuideArticle,
  faqs: CHURN_RATE_FAQS,
  countryRules: null,
};
