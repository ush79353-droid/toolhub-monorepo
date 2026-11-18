import type { ToolPageDetail } from '@/tools/page-detail';
import { MlToLbsGuideArticle } from './MlToLbsGuideArticle';
import { MLLBS_FAQS, MLLBS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert milliliters to pounds using substance density. Water defaults to ≈ 1000 kg/m³.',
  asideAriaLabel: 'Interactive mL to lbs converter',
  tocItems: MLLBS_TOC_ITEMS,
  GuideArticle: MlToLbsGuideArticle,
  faqs: MLLBS_FAQS,
  countryRules: null,
};
