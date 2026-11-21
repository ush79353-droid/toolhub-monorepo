import type { ToolPageDetail } from '@/tools/page-detail';
import { IraGuideArticle } from './IraGuideArticle';
import { IRA_FAQS, IRA_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare Traditional/SEP/SIMPLE-style and Roth IRA contribution paths with compound growth, amortized withdrawals, and IRS contribution-limit checks.',
  asideAriaLabel: 'Interactive IRA Calculator',
  tocItems: IRA_TOC_ITEMS,
  GuideArticle: IraGuideArticle,
  faqs: IRA_FAQS,
  countryRules: null,
};
