import type { ToolPageDetail } from '@/tools/page-detail';
import { SmokersCtcGuideArticle } from './SmokersCtcGuideArticle';
import { SMOKERS_CTC_FAQS, SMOKERS_CTC_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate paid smoke-break time cost, workday cigarette spend, and an illustrative life-expectancy line.',
  asideAriaLabel: 'Interactive smoker’s CTC calculator',
  tocItems: SMOKERS_CTC_TOC_ITEMS,
  GuideArticle: SmokersCtcGuideArticle,
  faqs: SMOKERS_CTC_FAQS,
  countryRules: null,
};
