import type { ToolPageDetail } from '@/tools/page-detail';
import { MortgageAccelerationGuideArticle } from './MortgageAccelerationGuideArticle';
import {
  MORTGAGE_ACCELERATION_FAQS,
  MORTGAGE_ACCELERATION_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare monthly vs accelerated bi-weekly (or overpayment) mortgage schedules; payment, term, interest, and payoff with independent FX on money fields.',
  asideAriaLabel: 'Interactive Mortgage Acceleration Calculator',
  tocItems: MORTGAGE_ACCELERATION_TOC_ITEMS,
  GuideArticle: MortgageAccelerationGuideArticle,
  faqs: MORTGAGE_ACCELERATION_FAQS,
  countryRules: null,
};
