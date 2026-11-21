import type { ToolPageDetail } from '@/tools/page-detail';
import { TwinPregnancyWeightGainGuideArticle } from './TwinPregnancyWeightGainGuideArticle';
import { TWIN_PWG_FAQS, TWIN_PWG_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate recommended twin pregnancy weight-gain ranges from pre-pregnancy BMI using IOM provisional twin guidelines (with singleton comparison when Twins = No).',
  asideAriaLabel: 'Interactive Twin Pregnancy Weight Gain Calculator',
  tocItems: TWIN_PWG_TOC_ITEMS,
  GuideArticle: TwinPregnancyWeightGainGuideArticle,
  faqs: TWIN_PWG_FAQS,
  countryRules: null,
};
