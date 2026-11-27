import type { ToolPageDetail } from '@/tools/page-detail';
import { IvFlowGuideArticle } from './IvFlowGuideArticle';
import { IV_FLOW_FAQS, IV_FLOW_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate IV drops/min and volume flow from drop factor, volume, and time — educational only.',
  asideAriaLabel: 'Interactive IV Flow Rate Calculator',
  tocItems: IV_FLOW_TOC_ITEMS,
  GuideArticle: IvFlowGuideArticle,
  faqs: IV_FLOW_FAQS,
  countryRules: null,
};
