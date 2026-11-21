import type { ToolPageDetail } from '@/tools/page-detail';
import { UnpaidWorkGuideArticle } from './UnpaidWorkGuideArticle';
import { UNPAID_WORK_FAQS, UNPAID_WORK_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate the replacement value of unpaid household work and compare it with professional hourly earnings. Currency follows the selected country and changes formatting only.',
  asideAriaLabel: 'Unpaid Work Calculator guide',
  tocItems: UNPAID_WORK_TOC_ITEMS,
  GuideArticle: UnpaidWorkGuideArticle,
  faqs: UNPAID_WORK_FAQS,
  countryRules: null,
};
