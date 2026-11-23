import type { ToolPageDetail } from '@/tools/page-detail';
import { ConceptionGuideArticle } from './ConceptionGuideArticle';
import { CONCEPTION_FAQS, CONCEPTION_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational conception dating from due date or LMP (EDD − 266 days) with gestational age as of today. Not an exact conception or paternity claim.',
  asideAriaLabel: 'Interactive Conception Calculator',
  tocItems: CONCEPTION_TOC_ITEMS,
  GuideArticle: ConceptionGuideArticle,
  faqs: CONCEPTION_FAQS,
  countryRules: null,
};
