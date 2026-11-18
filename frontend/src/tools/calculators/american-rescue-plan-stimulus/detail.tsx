import type { ToolPageDetail } from '@/tools/page-detail';
import { AmericanRescuePlanStimulusGuideArticle } from './AmericanRescuePlanStimulusGuideArticle';
import { ARP_STIMULUS_FAQS, ARP_STIMULUS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Historical estimate of the third Economic Impact Payment (EIP3) from the March 11, 2021 American Rescue Plan — not a currently available benefit.',
  asideAriaLabel: 'Historical third stimulus (American Rescue Plan) calculator guide',
  tocItems: ARP_STIMULUS_TOC_ITEMS,
  GuideArticle: AmericanRescuePlanStimulusGuideArticle,
  faqs: ARP_STIMULUS_FAQS,
};
