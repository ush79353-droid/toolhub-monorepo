import type { ToolPageDetail } from '@/tools/page-detail';
import { StimulusCheck40kGuideArticle } from './StimulusCheck40kGuideArticle';
import { STIMULUS_40K_FAQS, STIMULUS_40K_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Historical estimate of a 2020 second-round stimulus proposal using HEROES Act payment amounts with a publicly discussed $40,000 income cut-off. Not an active benefit.',
  asideAriaLabel: 'Historical stimulus check estimate details',
  tocItems: STIMULUS_40K_TOC_ITEMS,
  GuideArticle: StimulusCheck40kGuideArticle,
  faqs: STIMULUS_40K_FAQS,
};
