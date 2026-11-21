import type { ToolPageDetail } from '@/tools/page-detail';
import { RetirementWithdrawalGuideArticle } from './RetirementWithdrawalGuideArticle';
import { RW_FAQS, RW_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Solve for a sustainable retirement withdrawal or how long your nest egg lasts, with compounding, timing, and inflation. Currency changes formatting only.',
  asideAriaLabel: 'Interactive Retirement Withdrawal Calculator',
  tocItems: RW_TOC_ITEMS,
  GuideArticle: RetirementWithdrawalGuideArticle,
  faqs: RW_FAQS,
  countryRules: null,
};
