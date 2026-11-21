import type { ToolPageDetail } from '@/tools/page-detail';
import { RothIraGuideArticle } from './RothIraGuideArticle';
import { ROTH_IRA_FAQS, ROTH_IRA_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate IRS Roth IRA contribution limits after MAGI phase-outs and project a constant-return balance at retirement. Currency formats amounts only.',
  asideAriaLabel: 'Interactive Roth IRA Calculator',
  tocItems: ROTH_IRA_TOC_ITEMS,
  GuideArticle: RothIraGuideArticle,
  faqs: ROTH_IRA_FAQS,
  countryRules: null,
};
