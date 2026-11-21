import type { ToolPageDetail } from '@/tools/page-detail';
import { BmiWeightLossGuideArticle } from './BmiWeightLossGuideArticle';
import { BMI_WEIGHT_LOSS_FAQS, BMI_WEIGHT_LOSS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Use our BMI Weight Loss Calculator to find current BMI and BMI Prime, then set a target BMI to see target weight and how much to lose or gain. Optional CDC BMI-for-age percentiles for ages 2–19.',
  asideAriaLabel: 'Interactive BMI Weight Loss Calculator',
  tocItems: BMI_WEIGHT_LOSS_TOC_ITEMS,
  GuideArticle: BmiWeightLossGuideArticle,
  faqs: BMI_WEIGHT_LOSS_FAQS,
  countryRules: null,
};
