import type { ToolPageDetail } from '@/tools/page-detail';
import { UrineHomePregnancyTestGuideArticle } from './UrineHomePregnancyTestGuideArticle';
import {
  URINE_HOME_PREGNANCY_TEST_FAQS,
  URINE_HOME_PREGNANCY_TEST_TOC,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate when a urine home pregnancy test may be informative after natural conception or IVF—educational timing only, not a strip or lab interpreter.',
  asideAriaLabel: 'Interactive Urine Home Pregnancy Test calculator',
  tocItems: URINE_HOME_PREGNANCY_TEST_TOC,
  GuideArticle: UrineHomePregnancyTestGuideArticle,
  faqs: URINE_HOME_PREGNANCY_TEST_FAQS,
  countryRules: null,
};
