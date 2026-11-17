import type { ToolPageDetail } from '@/tools/page-detail';
import { KgToMlGuideArticle } from './KgToMlGuideArticle';
import { KG_TO_ML_FAQS, KG_TO_ML_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert kilograms to milliliters using substance density. Water defaults to ≈ 1000 kg/m³.',
  asideAriaLabel: 'Interactive kg to mL converter',
  tocItems: KG_TO_ML_TOC_ITEMS,
  GuideArticle: KgToMlGuideArticle,
  faqs: KG_TO_ML_FAQS,
  countryRules: null,
};
