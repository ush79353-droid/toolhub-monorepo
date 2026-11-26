import type { ToolPageDetail } from '@/tools/page-detail';
import { PonderalGuideArticle } from './PonderalGuideArticle';
import { PONDERAL_FAQS, PONDERAL_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compute Rohrer's ponderal index for adults or neonates — educational only.',
  asideAriaLabel: 'Interactive Ponderal Index Calculator',
  tocItems: PONDERAL_TOC_ITEMS,
  GuideArticle: PonderalGuideArticle,
  faqs: PONDERAL_FAQS,
  countryRules: null,
};
