import type { ToolPageDetail } from '@/tools/page-detail';
import { MlToKgGuideArticle } from './MlToKgGuideArticle';
import { MLKG_FAQS, MLKG_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert milliliters to kilograms using substance density. Water defaults to ≈ 1000 kg/m³.',
  asideAriaLabel: 'Interactive mL to kg converter',
  tocItems: MLKG_TOC_ITEMS,
  GuideArticle: MlToKgGuideArticle,
  faqs: MLKG_FAQS,
  countryRules: null,
};
