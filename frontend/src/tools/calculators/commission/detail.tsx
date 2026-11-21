import type { ToolPageDetail } from '@/tools/page-detail';
import { CommissionGuideArticle } from './CommissionGuideArticle';
import { COMMISSION_FAQS, COMMISSION_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Solve sales price, commission rate, or commission in USD—leave exactly one field blank.',
  asideAriaLabel: 'Interactive Commission Calculator',
  tocItems: COMMISSION_TOC_ITEMS,
  GuideArticle: CommissionGuideArticle,
  faqs: COMMISSION_FAQS,
  countryRules: null,
};
