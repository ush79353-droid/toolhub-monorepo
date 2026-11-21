import type { ToolPageDetail } from '@/tools/page-detail';
import { FetalWeightPercentileGuideArticle } from './FetalWeightPercentileGuideArticle';
import {
  FETAL_WEIGHT_PERCENTILE_FAQS,
  FETAL_WEIGHT_PERCENTILE_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate fetal weight from ultrasound biometry (Hadlock) and compare it with FMF gestational-age EFW centiles.',
  asideAriaLabel: 'Fetal Weight Percentile Calculator guide',
  tocItems: FETAL_WEIGHT_PERCENTILE_TOC_ITEMS,
  GuideArticle: FetalWeightPercentileGuideArticle,
  faqs: FETAL_WEIGHT_PERCENTILE_FAQS,
  countryRules: null,
};
