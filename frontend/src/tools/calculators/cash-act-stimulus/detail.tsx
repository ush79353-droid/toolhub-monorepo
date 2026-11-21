import type { ToolPageDetail } from '@/tools/page-detail';
import { CashActGuideArticle } from './CashActGuideArticle';
import { CASH_FAQS, CASH_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Historical, hypothetical estimate of the proposed December 2020 CASH Act second stimulus check; not a current benefit and not claimable today.',
  asideAriaLabel: 'CASH Act second stimulus calculator guide',
  tocItems: CASH_TOC_ITEMS,
  GuideArticle: CashActGuideArticle,
  faqs: CASH_FAQS,
};
