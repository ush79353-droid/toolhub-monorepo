import type { ToolPageDetail } from '@/tools/page-detail';
import { WinchSizeGuideArticle } from './WinchSizeGuideArticle';
import { WS_FAQS, WS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate winch pulling force from mass, terrain or drag resistance, slope, and a planning safety factor — compare with the 1.5× weight guideline; not a recovery safety certification.',
  asideAriaLabel: 'Interactive Winch Size Calculator',
  tocItems: WS_TOC_ITEMS,
  GuideArticle: WinchSizeGuideArticle,
  faqs: WS_FAQS,
  countryRules: null,
};
