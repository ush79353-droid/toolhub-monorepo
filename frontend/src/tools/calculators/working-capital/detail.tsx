import type { ToolPageDetail } from '@/tools/page-detail';
import { WorkingCapitalGuideArticle } from './WorkingCapitalGuideArticle';
import { WORKING_CAPITAL_FAQS, WORKING_CAPITAL_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate working capital and the current ratio, plus optional beginning/ending WC, average WC, change, and working capital turnover.',
  asideAriaLabel: 'Interactive Working Capital Calculator',
  tocItems: WORKING_CAPITAL_TOC_ITEMS,
  GuideArticle: WorkingCapitalGuideArticle,
  faqs: WORKING_CAPITAL_FAQS,
  countryRules: null,
};
