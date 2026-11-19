import type { ToolPageDetail } from '@/tools/page-detail';
import { CES_FAQS, CES_TOC_ITEMS } from './content';
import { CustomerEffortScoreGuideArticle } from './CustomerEffortScoreGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate Customer Effort Score (CES) from 1–5 or 1–7 survey response counts using a weighted average — lower scores mean less effort in this calculator.',
  asideAriaLabel: 'Customer Effort Score Calculator guide',
  tocItems: CES_TOC_ITEMS,
  GuideArticle: CustomerEffortScoreGuideArticle,
  faqs: CES_FAQS,
  countryRules: null,
};
