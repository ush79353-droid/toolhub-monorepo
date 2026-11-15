import type { ToolPageDetail } from '@/tools/page-detail';
import { PIXELS_TO_INCHES_FAQS, PIXELS_TO_INCHES_TOC_ITEMS } from './content';
import { PixelsToInchesGuideArticle } from './PixelsToInchesGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert pixels to inches and inches to pixels at any PPI. Default 96 PPI matches the CSS reference convention; change PPI for print and other resolutions.',
  asideAriaLabel: 'Interactive pixels to inches converter',
  tocItems: PIXELS_TO_INCHES_TOC_ITEMS,
  GuideArticle: PixelsToInchesGuideArticle,
  faqs: PIXELS_TO_INCHES_FAQS,
  countryRules: null,
};
