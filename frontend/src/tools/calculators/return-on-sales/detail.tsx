import type { ToolPageDetail } from '@/tools/page-detail';
import { ReturnOnSalesGuideArticle } from './ReturnOnSalesGuideArticle';
import { RETURN_ON_SALES_FAQS, RETURN_ON_SALES_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate return on sales from operating profit and net sales, with real FX on each money field. Distinct from net profit margin.',
  asideAriaLabel: 'Interactive Return on Sales Calculator',
  tocItems: RETURN_ON_SALES_TOC_ITEMS,
  GuideArticle: ReturnOnSalesGuideArticle,
  faqs: RETURN_ON_SALES_FAQS,
  countryRules: null,
};
