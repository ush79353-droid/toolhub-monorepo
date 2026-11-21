import type { ToolPageDetail } from '@/tools/page-detail';
import { SquareMilesToSquareKmGuideArticle } from './SquareMilesToSquareKmGuideArticle';
import { MI2_TO_KM2_FAQS, MI2_TO_KM2_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert square miles to square kilometers and back with the exact international-mile factor, plus optional other area units.',
  asideAriaLabel: 'Interactive square miles to square kilometers converter',
  tocItems: MI2_TO_KM2_TOC_ITEMS,
  GuideArticle: SquareMilesToSquareKmGuideArticle,
  faqs: MI2_TO_KM2_FAQS,
  countryRules: null,
};
