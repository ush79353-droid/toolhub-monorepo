import type { ToolPageDetail } from '@/tools/page-detail';
import { MlToTbspGuideArticle } from './MlToTbspGuideArticle';
import { MLTBSP_FAQS, MLTBSP_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert milliliters to tablespoons and cups. Defaults to US tbsp; switch metric, Australian, or Imperial.',
  asideAriaLabel: 'Interactive mL to tbsp converter',
  tocItems: MLTBSP_TOC_ITEMS,
  GuideArticle: MlToTbspGuideArticle,
  faqs: MLTBSP_FAQS,
  countryRules: null,
};
