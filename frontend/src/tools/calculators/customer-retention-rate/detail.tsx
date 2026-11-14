import type { ToolPageDetail } from '@/tools/page-detail';
import { CustomerRetentionRateGuideArticle } from './CustomerRetentionRateGuideArticle';
import { CUSTOMER_RETENTION_FAQS, CUSTOMER_RETENTION_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate customer retention and attrition from existing, new, and ending total customers.',
  asideAriaLabel: 'Interactive customer retention rate calculator',
  tocItems: CUSTOMER_RETENTION_TOC_ITEMS,
  GuideArticle: CustomerRetentionRateGuideArticle,
  faqs: CUSTOMER_RETENTION_FAQS,
  countryRules: null,
};
