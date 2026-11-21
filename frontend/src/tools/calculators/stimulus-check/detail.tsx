import type { ToolPageDetail } from '@/tools/page-detail';
import { StimulusCheckGuideArticle } from './StimulusCheckGuideArticle';
import { STIMULUS_CHECK_FAQS, STIMULUS_CHECK_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Historical estimate of the first Economic Impact Payment (EIP1) from the March 2020 CARES Act; not a currently available benefit.',
  asideAriaLabel: 'Historical first stimulus check calculator guide',
  tocItems: STIMULUS_CHECK_TOC_ITEMS,
  GuideArticle: StimulusCheckGuideArticle,
  faqs: STIMULUS_CHECK_FAQS,
};
