import type { ToolPageDetail } from '@/tools/page-detail';
import { SquareCmToSquareMmGuideArticle } from './SquareCmToSquareMmGuideArticle';
import { CM2_MM2_FAQS, CM2_MM2_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert square centimeters to square millimeters and back. Exact: 1 cm² = 100 mm².',
  asideAriaLabel: 'Interactive square centimeters to square millimeters converter',
  tocItems: CM2_MM2_TOC_ITEMS,
  GuideArticle: SquareCmToSquareMmGuideArticle,
  faqs: CM2_MM2_FAQS,
  countryRules: null,
};
