import type { ToolPageDetail } from '@/tools/page-detail';
import { NpvGuideArticle } from './NpvGuideArticle';
import { NPV_FAQS, NPV_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate net present value from a discount rate, initial costs, and annual cash flows.',
  asideAriaLabel: 'Interactive NPV Calculator',
  tocItems: NPV_TOC_ITEMS,
  GuideArticle: NpvGuideArticle,
  faqs: NPV_FAQS,
  countryRules: null,
};
