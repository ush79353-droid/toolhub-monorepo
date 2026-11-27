import type { ToolPageDetail } from '@/tools/page-detail';
import { BodyTypeGuideArticle } from './BodyTypeGuideArticle';
import { BODY_TYPE_FAQS, BODY_TYPE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate apparel body shape from bust, waist, high hip, and hip — educational only.',
  asideAriaLabel: 'Interactive Body Type Calculator',
  tocItems: BODY_TYPE_TOC_ITEMS,
  GuideArticle: BodyTypeGuideArticle,
  faqs: BODY_TYPE_FAQS,
  countryRules: null,
};
