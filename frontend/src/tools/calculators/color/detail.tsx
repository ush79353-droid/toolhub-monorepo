import type { ToolPageDetail } from '@/tools/page-detail';
import { ColorGuideArticle } from './ColorGuideArticle';
import { COLOR_FAQS, COLOR_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert colors between HEX, RGB, RGBA, HSL, HSLA, HSV, and CMYK with a live preview and copyable CSS-friendly codes.',
  asideAriaLabel: 'Interactive color converter',
  tocItems: COLOR_TOC_ITEMS,
  GuideArticle: ColorGuideArticle,
  faqs: COLOR_FAQS,
  countryRules: null,
};
