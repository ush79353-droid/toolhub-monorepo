import type { ToolPageDetail } from '@/tools/page-detail';
import { CostOfDoingBusinessGuideArticle } from './CostOfDoingBusinessGuideArticle';
import { COST_OF_DOING_BUSINESS_FAQS, COST_OF_DOING_BUSINESS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Divide total annual cost by billable days to get cost of doing business per billable day. Currency changes the denomination only.',
  asideAriaLabel: 'Interactive cost of doing business calculator',
  tocItems: COST_OF_DOING_BUSINESS_TOC_ITEMS,
  GuideArticle: CostOfDoingBusinessGuideArticle,
  faqs: COST_OF_DOING_BUSINESS_FAQS,
  countryRules: null,
};
