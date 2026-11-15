import type { ToolPageDetail } from '@/tools/page-detail';
import { BusinessValuationGuideArticle } from './BusinessValuationGuideArticle';
import { BUSINESS_VALUATION_FAQS, BUSINESS_VALUATION_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate business value with DCF, net assets, market capitalization, or a multiples method—one approach at a time.',
  asideAriaLabel: 'Interactive business valuation calculator',
  tocItems: BUSINESS_VALUATION_TOC_ITEMS,
  GuideArticle: BusinessValuationGuideArticle,
  faqs: BUSINESS_VALUATION_FAQS,
  countryRules: null,
};
