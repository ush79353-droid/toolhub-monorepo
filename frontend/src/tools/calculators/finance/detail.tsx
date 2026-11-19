import type { ToolPageDetail } from '@/tools/page-detail';
import { FINANCE_FAQS, FINANCE_TOC_ITEMS } from './content';
import { FinanceGuideArticle } from './FinanceGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Solve time-value-of-money problems for future value, present value, payments, interest rate, or number of periods. Currency changes formatting only.',
  asideAriaLabel: 'Finance Calculator guide',
  tocItems: FINANCE_TOC_ITEMS,
  GuideArticle: FinanceGuideArticle,
  faqs: FINANCE_FAQS,
  countryRules: null,
};
