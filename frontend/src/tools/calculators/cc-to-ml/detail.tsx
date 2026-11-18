import type { ToolPageDetail } from '@/tools/page-detail';
import { CcToMlGuideArticle } from './CcToMlGuideArticle';
import { CC_TO_ML_FAQS, CC_TO_ML_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert cubic centimeters (cc) to milliliters (mL) and liters instantly. Exact: 1 cc = 1 mL; 1000 cc = 1 L.',
  asideAriaLabel: 'Interactive cc to mL converter',
  tocItems: CC_TO_ML_TOC_ITEMS,
  GuideArticle: CcToMlGuideArticle,
  faqs: CC_TO_ML_FAQS,
  countryRules: null,
};
