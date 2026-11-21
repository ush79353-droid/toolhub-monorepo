import type { ToolPageDetail } from '@/tools/page-detail';
import { SalesGuideArticle } from './SalesGuideArticle';
import { SALES_FAQS, SALES_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate gross and net sales from product price and units sold, with optional returns, allowances, and discounts, plus independent FX on every money field.',
  asideAriaLabel: 'Interactive Sales Calculator',
  tocItems: SALES_TOC_ITEMS,
  GuideArticle: SalesGuideArticle,
  faqs: SALES_FAQS,
  countryRules: null,
};
