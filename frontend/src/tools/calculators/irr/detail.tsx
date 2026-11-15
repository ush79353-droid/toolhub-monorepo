import type { ToolPageDetail } from '@/tools/page-detail';
import { IrrGuideArticle } from './IrrGuideArticle';
import { IRR_FAQS, IRR_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead: 'Find the annual IRR that sets the NPV of your investment cash flows to zero.',
  asideAriaLabel: 'Interactive IRR Calculator',
  tocItems: IRR_TOC_ITEMS,
  GuideArticle: IrrGuideArticle,
  faqs: IRR_FAQS,
  countryRules: null,
};
