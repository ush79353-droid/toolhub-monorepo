import type { ToolPageDetail } from '@/tools/page-detail';
import { PositivePregnancyTestAt3WeeksGuideArticle } from './PositivePregnancyTestAt3WeeksGuideArticle';
import { PPT3_FAQS, PPT3_TOC } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational timing for when a urine or blood pregnancy test may be informative after natural conception or IVF—not a yes/no verdict about testing positive at 3 weeks.',
  asideAriaLabel:
    'Positive pregnancy test at 3 weeks — educational timing calculator',
  tocItems: PPT3_TOC,
  GuideArticle: PositivePregnancyTestAt3WeeksGuideArticle,
  faqs: PPT3_FAQS,
  countryRules: null,
};
