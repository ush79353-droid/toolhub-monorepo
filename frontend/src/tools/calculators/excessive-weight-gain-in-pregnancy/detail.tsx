import type { ToolPageDetail } from '@/tools/page-detail';
import { ExcessiveWeightGainGuideArticle } from './ExcessiveWeightGainGuideArticle';
import { EWG_FAQS, EWG_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'See IOM recommended pregnancy weight and gain ranges from pre-pregnancy BMI—and use them as a starting point when discussing gain that may be above or below target with your clinician.',
  asideAriaLabel:
    'Interactive excessive weight gain in pregnancy guideline widget',
  tocItems: EWG_TOC_ITEMS,
  GuideArticle: ExcessiveWeightGainGuideArticle,
  faqs: EWG_FAQS,
  countryRules: null,
};
