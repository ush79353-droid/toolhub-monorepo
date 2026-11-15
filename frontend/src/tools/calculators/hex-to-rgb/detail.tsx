import type { ToolPageDetail } from '@/tools/page-detail';
import { HexToRgbGuideArticle } from './HexToRgbGuideArticle';
import { HEX_RGB_FAQS, HEX_RGB_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert HEX to RGB and RGB to HEX with optional three-digit shorthand, live preview, and copyable results.',
  asideAriaLabel: 'Interactive HEX to RGB converter',
  tocItems: HEX_RGB_TOC_ITEMS,
  GuideArticle: HexToRgbGuideArticle,
  faqs: HEX_RGB_FAQS,
  countryRules: null,
};
