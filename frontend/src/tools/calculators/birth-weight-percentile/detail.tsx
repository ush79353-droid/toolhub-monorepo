import type { ToolPageDetail } from '@/tools/page-detail';
import { BirthWeightPercentileGuideArticle } from './BirthWeightPercentileGuideArticle';
import {
  BIRTH_WEIGHT_PERCENTILE_FAQS,
  BIRTH_WEIGHT_PERCENTILE_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare birth weight with Fetal Medicine Foundation (FMF) gestational-age birth-weight centiles and see the band on a simple chart.',
  asideAriaLabel: 'Birth Weight Percentile Calculator guide',
  tocItems: BIRTH_WEIGHT_PERCENTILE_TOC_ITEMS,
  GuideArticle: BirthWeightPercentileGuideArticle,
  faqs: BIRTH_WEIGHT_PERCENTILE_FAQS,
  countryRules: null,
};
