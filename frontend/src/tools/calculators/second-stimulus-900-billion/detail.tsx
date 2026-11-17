import type { ToolPageDetail } from '@/tools/page-detail';
import { SecondStimulus900BillionGuideArticle } from './SecondStimulus900BillionGuideArticle';
import {
  SECOND_STIMULUS_900B_FAQS,
  SECOND_STIMULUS_900B_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Historical estimate of the second Economic Impact Payment (EIP2) from the December 2020 $900 billion COVID relief bill — not a currently available benefit.',
  asideAriaLabel: 'Historical second stimulus ($900 billion) calculator guide',
  tocItems: SECOND_STIMULUS_900B_TOC_ITEMS,
  GuideArticle: SecondStimulus900BillionGuideArticle,
  faqs: SECOND_STIMULUS_900B_FAQS,
};
