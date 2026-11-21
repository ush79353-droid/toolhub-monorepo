import type { ToolPageDetail } from '@/tools/page-detail';
import { McgToMlGuideArticle } from './McgToMlGuideArticle';
import { MCG_TO_ML_FAQS, MCG_TO_ML_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert micrograms (mcg) to milliliters (mL) using medication concentration or substance density; never a fixed universal factor.',
  asideAriaLabel: 'Interactive mcg to mL conversion calculator',
  tocItems: MCG_TO_ML_TOC_ITEMS,
  GuideArticle: McgToMlGuideArticle,
  faqs: MCG_TO_ML_FAQS,
  countryRules: null,
};
