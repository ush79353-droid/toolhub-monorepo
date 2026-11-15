import type { ToolPageDetail } from '@/tools/page-detail';
import { SavingsInterestRateGuideArticle } from './SavingsInterestRateGuideArticle';
import {
  SAVINGS_INTEREST_RATE_FAQS,
  SAVINGS_INTEREST_RATE_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Find the annual savings interest rate needed to reach your goal from starting balance, deposits, compounding, and time.',
  asideAriaLabel: 'Interactive savings interest rate calculator',
  tocItems: SAVINGS_INTEREST_RATE_TOC_ITEMS,
  GuideArticle: SavingsInterestRateGuideArticle,
  faqs: SAVINGS_INTEREST_RATE_FAQS,
  countryRules: null,
};
