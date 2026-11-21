import type { ToolPageDetail } from '@/tools/page-detail';
import { ConsumerSurplusGuideArticle } from './ConsumerSurplusGuideArticle';
import { CS_FAQS, CS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate the benefit from paying less than maximum willingness to pay — CS = WTP − P — with clear handling when price exceeds willingness to pay, plus optional reverse modes.',
  asideAriaLabel: 'Interactive Consumer Surplus Calculator',
  tocItems: CS_TOC_ITEMS,
  GuideArticle: ConsumerSurplusGuideArticle,
  faqs: CS_FAQS,
  countryRules: null,
};
