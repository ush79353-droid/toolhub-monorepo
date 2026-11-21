import type { ToolPageDetail } from '@/tools/page-detail';
import { PregnancyTestGuideArticle } from './PregnancyTestGuideArticle';
import { PREGNANCY_TEST_FAQS, PREGNANCY_TEST_TOC } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Use our Pregnancy Test Calculator to estimate when urine and blood tests may be informative after natural conception or IVF—educational timing only, not a lab result interpreter.',
  asideAriaLabel: 'Interactive Pregnancy Test Calculator',
  tocItems: PREGNANCY_TEST_TOC,
  GuideArticle: PregnancyTestGuideArticle,
  faqs: PREGNANCY_TEST_FAQS,
  countryRules: null,
};
