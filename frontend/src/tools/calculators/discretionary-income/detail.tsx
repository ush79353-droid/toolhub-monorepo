import type { ToolPageDetail } from '@/tools/page-detail';
import { DiscretionaryIncomeGuideArticle } from './DiscretionaryIncomeGuideArticle';
import {
  DISCRETIONARY_INCOME_FAQS,
  DISCRETIONARY_INCOME_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate discretionary income for student-loan repayment estimates or personal budgeting, with clear formulas and worked examples.',
  asideAriaLabel: 'Interactive Discretionary Income Calculator',
  tocItems: DISCRETIONARY_INCOME_TOC_ITEMS,
  GuideArticle: DiscretionaryIncomeGuideArticle,
  faqs: DISCRETIONARY_INCOME_FAQS,
  countryRules: null,
};
