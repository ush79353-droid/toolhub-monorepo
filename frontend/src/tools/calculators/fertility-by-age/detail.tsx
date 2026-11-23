import type { ToolPageDetail } from '@/tools/page-detail';
import { FertilityByAgeGuideArticle } from './FertilityByAgeGuideArticle';
import {
  FERTILITY_BY_AGE_FAQS,
  FERTILITY_BY_AGE_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational average chance of pregnancy per menstrual cycle by female age. Cohort estimate only — not individualized prediction.',
  asideAriaLabel: 'Interactive Fertility by Age Calculator',
  tocItems: FERTILITY_BY_AGE_TOC_ITEMS,
  GuideArticle: FertilityByAgeGuideArticle,
  faqs: FERTILITY_BY_AGE_FAQS,
  countryRules: null,
};
