import type { ToolPageDetail } from '@/tools/page-detail';
import {
  LITERS_TO_CENTILITERS_FAQS,
  LITERS_TO_CENTILITERS_TOC_ITEMS,
} from './content';
import { LitersToCentilitersGuideArticle } from './LitersToCentilitersGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert liters to centiliters and centiliters to liters instantly using the exact factor 1 L = 100 cL.',
  asideAriaLabel: 'Interactive liters to centiliters converter',
  tocItems: LITERS_TO_CENTILITERS_TOC_ITEMS,
  GuideArticle: LitersToCentilitersGuideArticle,
  faqs: LITERS_TO_CENTILITERS_FAQS,
  countryRules: null,
};
