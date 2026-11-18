import type { ToolPageDetail } from '@/tools/page-detail';
import { CcToLiterGuideArticle } from './CcToLiterGuideArticle';
import { CC_TO_LITER_FAQS, CC_TO_LITER_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert cubic centimeters (cc or cm³) to liters and back instantly using the exact factor 1 L = 1000 cc.',
  asideAriaLabel: 'Interactive cc to liter converter',
  tocItems: CC_TO_LITER_TOC_ITEMS,
  GuideArticle: CcToLiterGuideArticle,
  faqs: CC_TO_LITER_FAQS,
  countryRules: null,
};
