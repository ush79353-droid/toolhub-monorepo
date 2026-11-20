import type { ToolPageDetail } from '@/tools/page-detail';
import { CreditUtilizationGuideArticle } from './CreditUtilizationGuideArticle';
import {
  CREDIT_UTILIZATION_FAQS,
  CREDIT_UTILIZATION_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate overall credit utilization across multiple revolving accounts, plus available credit and the balance reduction needed for a target ratio.',
  asideAriaLabel: 'Interactive Credit Utilization Calculator',
  tocItems: CREDIT_UTILIZATION_TOC_ITEMS,
  GuideArticle: CreditUtilizationGuideArticle,
  faqs: CREDIT_UTILIZATION_FAQS,
  countryRules: null,
};
