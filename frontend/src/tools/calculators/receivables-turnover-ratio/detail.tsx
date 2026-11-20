import type { ToolPageDetail } from '@/tools/page-detail';
import { ReceivablesTurnoverRatioGuideArticle } from './ReceivablesTurnoverRatioGuideArticle';
import {
  RECEIVABLES_TURNOVER_FAQS,
  RECEIVABLES_TURNOVER_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate the receivables turnover ratio from net credit sales and average accounts receivable (opening and closing AR).',
  asideAriaLabel: 'Interactive Receivables Turnover Ratio Calculator',
  tocItems: RECEIVABLES_TURNOVER_TOC_ITEMS,
  GuideArticle: ReceivablesTurnoverRatioGuideArticle,
  faqs: RECEIVABLES_TURNOVER_FAQS,
  countryRules: null,
};
