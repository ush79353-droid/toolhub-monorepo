import type { ToolPageDetail } from '@/tools/page-detail';
import { MCG_TO_MG_FAQS, MCG_TO_MG_TOC_ITEMS } from './content';
import { McgToMgGuideArticle } from './McgToMgGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert micrograms (mcg) to milligrams (mg) and milligrams to micrograms using the exact factor 1 mg = 1000 mcg.',
  asideAriaLabel: 'Interactive mcg to mg converter',
  tocItems: MCG_TO_MG_TOC_ITEMS,
  GuideArticle: McgToMgGuideArticle,
  faqs: MCG_TO_MG_FAQS,
  countryRules: null,
};
