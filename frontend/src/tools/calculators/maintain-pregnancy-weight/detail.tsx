import type { ToolPageDetail } from '@/tools/page-detail';
import { MaintainPregnancyWeightGuideArticle } from './MaintainPregnancyWeightGuideArticle';
import { FAQS, TOC } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'See educational IOM/CDC gestational weight-gain ranges from pre-pregnancy BMI and week. This page does not create pregnancy weight-loss diets.',
  asideAriaLabel: 'Pregnancy weight guidance calculator',
  tocItems: TOC,
  GuideArticle: MaintainPregnancyWeightGuideArticle,
  faqs: FAQS,
  countryRules: null,
};
