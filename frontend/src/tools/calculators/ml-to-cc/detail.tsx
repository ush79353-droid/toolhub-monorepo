import type { ToolPageDetail } from '@/tools/page-detail';
import { MlToCcGuideArticle } from './MlToCcGuideArticle';
import { MLCC_FAQS, MLCC_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert milliliters to cubic centimeters and liters. Exact: 1 mL = 1 cc = 1 cm³.',
  asideAriaLabel: 'Interactive mL to cc converter',
  tocItems: MLCC_TOC_ITEMS,
  GuideArticle: MlToCcGuideArticle,
  faqs: MLCC_FAQS,
  countryRules: null,
};
