import type { ToolPageDetail } from '@/tools/page-detail';
import { BodyFrameSizeGuideArticle } from './BodyFrameSizeGuideArticle';
import { BODY_FRAME_SIZE_FAQS, BODY_FRAME_SIZE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate body frame size from height and wrist circumference — educational only.',
  asideAriaLabel: 'Interactive Body Frame Size Calculator',
  tocItems: BODY_FRAME_SIZE_TOC_ITEMS,
  GuideArticle: BodyFrameSizeGuideArticle,
  faqs: BODY_FRAME_SIZE_FAQS,
  countryRules: null,
};
