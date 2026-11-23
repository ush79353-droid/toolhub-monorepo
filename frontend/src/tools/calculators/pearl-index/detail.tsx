import type { ToolPageDetail } from '@/tools/page-detail';
import { PearlIndexGuideArticle } from './PearlIndexGuideArticle';
import { PEARL_INDEX_FAQS, PEARL_INDEX_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational Pearl Index from study women, duration, and pregnancies — a failure rate per 100 woman-years, not personal contraceptive advice.',
  asideAriaLabel: 'Interactive Pearl Index Calculator',
  tocItems: PEARL_INDEX_TOC_ITEMS,
  GuideArticle: PearlIndexGuideArticle,
  faqs: PEARL_INDEX_FAQS,
  countryRules: null,
};
