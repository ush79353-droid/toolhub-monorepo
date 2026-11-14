import type { ToolPageDetail } from '@/tools/page-detail';
import { ProfitabilityIndexGuideArticle } from './ProfitabilityIndexGuideArticle';
import { PI_FAQS, PI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare the present value of future cash flows with your initial investment to get a simple profitability index (PI).',
  asideAriaLabel: 'Interactive profitability index calculator',
  tocItems: PI_TOC_ITEMS,
  GuideArticle: ProfitabilityIndexGuideArticle,
  faqs: PI_FAQS,
  countryRules: null,
};
