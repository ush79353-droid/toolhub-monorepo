import type { ToolPageDetail } from '@/tools/page-detail';
import { IsBmiPregnancyWeightIndicatorGuideArticle } from './IsBmiPregnancyWeightIndicatorGuideArticle';
import { IS_BMI_PREGNANCY_FAQS, IS_BMI_PREGNANCY_TOC } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'See how pre-pregnancy BMI selects IOM gestational weight-gain guideline bands—and why BMI itself is not a measure of weight gained during pregnancy.',
  asideAriaLabel:
    'Interactive BMI and pregnancy weight-gain indicator widget',
  tocItems: IS_BMI_PREGNANCY_TOC,
  GuideArticle: IsBmiPregnancyWeightIndicatorGuideArticle,
  faqs: IS_BMI_PREGNANCY_FAQS,
  countryRules: null,
};
