import type { ToolPageDetail } from '@/tools/page-detail';
import { CurtainSizeGuideArticle } from './CurtainSizeGuideArticle';
import { CURTAIN_SIZE_FAQS, CURTAIN_SIZE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate recommended curtain length, total flat width, and panel sizes from window measurements, style, and fullness.',
  asideAriaLabel: 'Interactive Curtain Size Calculator',
  tocItems: CURTAIN_SIZE_TOC_ITEMS,
  GuideArticle: CurtainSizeGuideArticle,
  faqs: CURTAIN_SIZE_FAQS,
  countryRules: null,
};
