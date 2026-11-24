import type { ToolPageDetail } from '@/tools/page-detail';
import { MCG_TO_IU_FAQS, MCG_TO_IU_TOC_ITEMS } from './content';
import { McgToIuGuideArticle } from './McgToIuGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert mcg ↔ IU for vitamin D, A, and E using NIH ODS / FDA labeled factors. Substance-specific — never a universal multiplier.',
  asideAriaLabel: 'Interactive mcg to IU converter',
  tocItems: MCG_TO_IU_TOC_ITEMS,
  GuideArticle: McgToIuGuideArticle,
  faqs: MCG_TO_IU_FAQS,
  countryRules: null,
};
