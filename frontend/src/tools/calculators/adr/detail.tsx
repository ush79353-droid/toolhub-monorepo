import type { ToolPageDetail } from '@/tools/page-detail';
import { ADR_FAQS, ADR_TOC_ITEMS } from './content';
import { ADRGuideArticle } from './ADRGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Divide room revenue by room-nights sold. Add inventory only when you also want occupancy and RevPAR.',
  asideAriaLabel: 'Interactive hotel ADR calculator',
  tocItems: ADR_TOC_ITEMS,
  GuideArticle: ADRGuideArticle,
  faqs: ADR_FAQS,
  countryRules: null,
};
