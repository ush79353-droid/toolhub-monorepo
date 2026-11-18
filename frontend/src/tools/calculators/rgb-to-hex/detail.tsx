import type { ToolPageDetail } from '@/tools/page-detail';
import { RgbToHexGuideArticle } from './RgbToHexGuideArticle';
import { RGB_HEX_FAQS, RGB_HEX_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert RGB to HEX and HEX to RGB instantly with live preview, validation, and copyable color codes.',
  asideAriaLabel: 'Interactive RGB to HEX converter',
  tocItems: RGB_HEX_TOC_ITEMS,
  GuideArticle: RgbToHexGuideArticle,
  faqs: RGB_HEX_FAQS,
  countryRules: null,
};
